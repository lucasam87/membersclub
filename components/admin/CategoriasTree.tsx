'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reordenarCategorias } from '@/app/(admin)/admin/categorias/actions'
import type { Tables } from '@/types/database'

type Categoria = Tables<'categorias'>

// 'root' agrupa as categorias de nivel 1. Cada categoria-pai vira, ela
// mesma, um container (a chave e' o id dela) que guarda suas subcategorias.
// Isso limita a hierarquia a 2 niveis por construcao: um item so pode ser
// arrastado para dentro de outro container se ele proprio nao for um
// container (ou seja, se nao tiver filhos) — ver `podeReceberFilhos`.
const RAIZ = 'raiz'

function agruparPorPai(categorias: Categoria[]) {
  const grupos: Record<string, string[]> = { [RAIZ]: [] }
  const porId = new Map(categorias.map((c) => [c.id, c]))

  for (const c of categorias) {
    if (!c.categoria_pai_id || !porId.has(c.categoria_pai_id)) {
      grupos[RAIZ].push(c.id)
    } else {
      grupos[c.categoria_pai_id] ??= []
      grupos[c.categoria_pai_id].push(c.id)
    }
  }
  for (const id of porId.keys()) grupos[id] ??= []

  for (const chave of Object.keys(grupos)) {
    grupos[chave].sort((a, b) => (porId.get(a)?.ordem ?? 0) - (porId.get(b)?.ordem ?? 0))
  }
  return grupos
}

export function CategoriasTree({ categorias }: { categorias: Categoria[] }) {
  const porId = new Map(categorias.map((c) => [c.id, c]))
  const [grupos, setGrupos] = useState(() => agruparPorPai(categorias))
  const [ativoId, setAtivoId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function encontrarContainer(id: string) {
    if (id in grupos) return id
    return Object.keys(grupos).find((chave) => grupos[chave].includes(id))
  }

  // Uma categoria so pode "receber" itens (virar pai) se ela mesma nao for
  // subcategoria de outra — evita hierarquia com 3 niveis.
  function podeReceberFilhos(containerId: string) {
    if (containerId === RAIZ) return true
    const pai = encontrarContainer(containerId)
    return pai === RAIZ
  }

  function handleDragStart(event: DragStartEvent) {
    setAtivoId(String(event.active.id))
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const ativoContainer = encontrarContainer(String(active.id))
    const overContainer = encontrarContainer(String(over.id))
    if (!ativoContainer || !overContainer || ativoContainer === overContainer) return
    if (!podeReceberFilhos(overContainer)) return
    // Uma categoria que ja tem subcategorias nao pode virar subcategoria de outra.
    if (grupos[String(active.id)]?.length > 0) return

    setGrupos((atual) => {
      const origem = atual[ativoContainer].filter((id) => id !== active.id)
      const destino = [...atual[overContainer]]
      const overEhContainer = String(over.id) === overContainer
      const indice = overEhContainer ? destino.length : destino.indexOf(String(over.id))
      destino.splice(indice < 0 ? destino.length : indice, 0, String(active.id))
      return { ...atual, [ativoContainer]: origem, [overContainer]: destino }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setAtivoId(null)
    if (!over) return

    const container = encontrarContainer(String(active.id))
    if (!container) return
    const overContainer = encontrarContainer(String(over.id)) ?? container

    let novosGrupos = grupos
    if (container === overContainer) {
      const itens = [...grupos[container]]
      const indiceAntigo = itens.indexOf(String(active.id))
      const indiceNovo = itens.indexOf(String(over.id))
      if (indiceAntigo !== -1 && indiceNovo !== -1 && indiceAntigo !== indiceNovo) {
        itens.splice(indiceAntigo, 1)
        itens.splice(indiceNovo, 0, String(active.id))
        novosGrupos = { ...grupos, [container]: itens }
        setGrupos(novosGrupos)
      }
    }

    persistir(novosGrupos)
  }

  function persistir(estado: typeof grupos) {
    const atualizacoes: { id: string; categoria_pai_id: string | null; ordem: number }[] = []

    for (const [containerId, itens] of Object.entries(estado)) {
      itens.forEach((id, indice) => {
        const categoria = porId.get(id)
        if (!categoria) return
        const novoPaiId = containerId === RAIZ ? null : containerId
        if (categoria.categoria_pai_id !== novoPaiId || categoria.ordem !== indice) {
          atualizacoes.push({ id, categoria_pai_id: novoPaiId, ordem: indice })
        }
      })
    }

    if (atualizacoes.length === 0) return

    startTransition(async () => {
      const resultado = await reordenarCategorias(atualizacoes)
      if (resultado?.erro) {
        toast.error('Nao foi possivel salvar a nova ordem: ' + resultado.erro)
        setGrupos(agruparPorPai(categorias))
      }
    })
  }

  const ativo = ativoId ? porId.get(ativoId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-3">
        <SortableContext items={grupos[RAIZ]} strategy={verticalListSortingStrategy}>
          {grupos[RAIZ].map((id) => {
            const categoria = porId.get(id)
            if (!categoria) return null
            return (
              <CategoriaRaizItem
                key={id}
                categoria={categoria}
                subcategorias={(grupos[id] ?? []).map((sid) => porId.get(sid)).filter(Boolean) as Categoria[]}
              />
            )
          })}
        </SortableContext>
        {grupos[RAIZ].length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
        )}
      </div>
      <DragOverlay>
        {ativo ? (
          <div className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-md">
            {ativo.nome}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function CategoriaRaizItem({
  categoria,
  subcategorias,
}: {
  categoria: Categoria
  subcategorias: Categoria[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: categoria.id,
  })
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: categoria.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-card ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Arrastar para reordenar"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <Link href={`/admin/categorias/${categoria.id}`} className="flex-1 text-sm font-medium hover:underline">
          {categoria.nome}
        </Link>
        <Badge variant="secondary">{subcategorias.length} sub{subcategorias.length === 1 ? '' : 's'}</Badge>
        <Button
          render={<Link href={`/admin/categorias/novo?pai=${categoria.id}`} aria-label="Nova subcategoria" />}
          nativeButton={false}
          variant="ghost"
          size="icon-sm"
        >
          <Plus />
        </Button>
      </div>

      <div
        ref={setDroppableRef}
        className={`min-h-2 space-y-1.5 border-t border-border/60 px-3 py-2 pl-8 ${
          isOver ? 'bg-accent/50' : ''
        }`}
      >
        <SortableContext items={subcategorias.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {subcategorias.map((sub) => (
            <SubcategoriaItem key={sub.id} categoria={sub} />
          ))}
        </SortableContext>
        {subcategorias.length === 0 && (
          <p className="py-1 text-xs text-muted-foreground">
            Arraste uma categoria aqui para torna-la subcategoria.
          </p>
        )}
      </div>
    </div>
  )
}

function SubcategoriaItem({ categoria }: { categoria: Categoria }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: categoria.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md border border-border/60 bg-background px-2.5 py-1.5 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Arrastar para reordenar"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" />
      </button>
      <Link href={`/admin/categorias/${categoria.id}`} className="flex-1 text-sm hover:underline">
        {categoria.nome}
      </Link>
    </div>
  )
}
