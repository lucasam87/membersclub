import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { salvarCategoria, excluirCategoria } from '@/app/(admin)/admin/categorias/actions'
import type { Tables } from '@/types/database'

function opcoesComProfundidade(categorias: Tables<'categorias'>[], excluirId?: string) {
  const porPai = new Map<string | null, Tables<'categorias'>[]>()
  for (const c of categorias) {
    const chave = c.categoria_pai_id
    porPai.set(chave, [...(porPai.get(chave) ?? []), c])
  }

  const opcoes: { id: string; label: string }[] = []
  function visitar(paiId: string | null, profundidade: number) {
    for (const c of porPai.get(paiId) ?? []) {
      if (c.id === excluirId) continue
      opcoes.push({ id: c.id, label: `${'— '.repeat(profundidade)}${c.nome}` })
      visitar(c.id, profundidade + 1)
    }
  }
  visitar(null, 0)
  return opcoes
}

export function CategoriaForm({
  categoria,
  categorias,
  paiPadrao,
  erro,
}: {
  categoria?: Tables<'categorias'>
  categorias: Tables<'categorias'>[]
  paiPadrao?: string
  erro?: string
}) {
  const opcoes = opcoesComProfundidade(categorias, categoria?.id)

  return (
    <div className="max-w-md space-y-4">
      <form action={salvarCategoria} className="space-y-4">
        {categoria && <input type="hidden" name="id" value={categoria.id} />}

        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" name="nome" defaultValue={categoria?.nome} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria_pai_id">Categoria pai (opcional)</Label>
          <select
            id="categoria_pai_id"
            name="categoria_pai_id"
            defaultValue={categoria?.categoria_pai_id ?? paiPadrao ?? ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
          >
            <option value="">Nenhuma (categoria raiz)</option>
            {opcoes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit">Salvar</Button>
      </form>

      {categoria && (
        <form action={excluirCategoria}>
          <input type="hidden" name="id" value={categoria.id} />
          <Button type="submit" variant="destructive">
            Excluir
          </Button>
        </form>
      )}
    </div>
  )
}
