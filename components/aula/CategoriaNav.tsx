import Link from 'next/link'
import { Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { isAulaLiberada } from '@/lib/progresso/regras'
import { cn } from '@/lib/utils'
import type { Tables } from '@/types/database'

export async function CategoriaNav({ aulaAtualId }: { aulaAtualId: string }) {
  const supabase = await createClient()

  const { data: aulaAtual } = await supabase
    .from('aulas')
    .select('*, categorias(*)')
    .eq('id', aulaAtualId)
    .single()

  if (!aulaAtual) return null

  const subcategoriaAtual = aulaAtual.categorias as unknown as Tables<'categorias'>
  const temPai = Boolean(subcategoriaAtual.categoria_pai_id)

  // Grupos = subcategorias irmas (navegacao livre entre elas) quando a
  // categoria da aula tem pai; caso contrario, um unico grupo (a propria
  // categoria, que age como "folha").
  const grupos: Tables<'categorias'>[] = temPai
    ? ((
        await supabase
          .from('categorias')
          .select('*')
          .eq('categoria_pai_id', subcategoriaAtual.categoria_pai_id!)
          .order('ordem')
      ).data ?? [])
    : [subcategoriaAtual]

  const { data: categoriaPai } = temPai
    ? await supabase
        .from('categorias')
        .select('*')
        .eq('id', subcategoriaAtual.categoria_pai_id!)
        .single()
    : { data: null }

  const usuario = await getUser()

  const gruposComAulas = await Promise.all(
    grupos.map(async (grupo) => {
      const { data: aulas } = await supabase
        .from('aulas')
        .select('id, titulo, ordem')
        .eq('categoria_id', grupo.id)
        .order('ordem')
      const lista = aulas ?? []
      const minOrdem = lista.length > 0 ? Math.min(...lista.map((a) => a.ordem)) : 0

      const { data: progressos } = usuario
        ? await supabase
            .from('progresso_aluno')
            .select('aula_id, liberada')
            .eq('usuario_id', usuario.id)
            .in('aula_id', lista.map((a) => a.id))
        : { data: [] }

      const progressoPorAula = new Map((progressos ?? []).map((p) => [p.aula_id, p]))

      return { grupo, aulas: lista, minOrdem, progressoPorAula }
    })
  )

  return (
    <nav className="space-y-6 p-4">
      {categoriaPai && (
        <Link
          href={`/categoria/${categoriaPai.slug}`}
          className="block text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {categoriaPai.nome}
        </Link>
      )}
      {gruposComAulas.map(({ grupo, aulas, minOrdem, progressoPorAula }) => (
        <div key={grupo.id} className="space-y-1">
          <p className="px-2 text-sm font-semibold">{grupo.nome}</p>
          <ul className="space-y-0.5">
            {aulas.map((aula) => {
              const ativa = aula.id === aulaAtualId
              const liberada = isAulaLiberada(aula, minOrdem, progressoPorAula.get(aula.id))
              return (
                <li key={aula.id}>
                  {liberada ? (
                    <Link
                      href={`/aula/${aula.id}`}
                      className={cn(
                        'flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
                        ativa && 'bg-accent font-medium text-accent-foreground'
                      )}
                    >
                      {aula.titulo}
                    </Link>
                  ) : (
                    <span className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted-foreground">
                      {aula.titulo}
                      <span className="sr-only"> (bloqueada)</span>
                      <Lock className="size-3.5" aria-hidden="true" />
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
