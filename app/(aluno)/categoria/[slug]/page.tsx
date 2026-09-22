import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { mapaLiberacao } from '@/lib/progresso/regras'
import { CategoriaRow } from '@/components/catalogo/CategoriaRow'
import { AulaCard } from '@/components/catalogo/AulaCard'
import type { Tables } from '@/types/database'

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const usuario = await getUser()

  const { data: categoria } = await supabase
    .from('categorias')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!categoria) notFound()

  const { data: subcategorias } = await supabase
    .from('categorias')
    .select('*')
    .eq('categoria_pai_id', categoria.id)
    .order('ordem')

  const listaSub = (subcategorias ?? []) as Tables<'categorias'>[]

  if (listaSub.length > 0) {
    const linhas = await Promise.all(
      listaSub.map(async (sub) => {
        const { data: aulas } = await supabase
          .from('aulas')
          .select('id, titulo, youtube_url, categoria_id, ordem')
          .eq('categoria_id', sub.id)
          .order('ordem')

        return { categoria: sub, aulas: aulas ?? [] }
      })
    )

    const liberacao = await mapaLiberacao(
      supabase,
      usuario?.id,
      linhas.flatMap((l) => l.aulas)
    )

    return (
      <div className="space-y-8 py-8">
        <h1 className="px-6 text-2xl font-semibold">{categoria.nome}</h1>
        {linhas.map(({ categoria: sub, aulas }) => (
          <CategoriaRow key={sub.id} categoria={sub} aulas={aulas} liberacao={liberacao} />
        ))}
      </div>
    )
  }

  const { data: aulas } = await supabase
    .from('aulas')
    .select('id, titulo, youtube_url, categoria_id, ordem')
    .eq('categoria_id', categoria.id)
    .order('ordem')

  const lista = aulas ?? []
  const liberacao = await mapaLiberacao(supabase, usuario?.id, lista)

  return (
    <div className="space-y-6 px-6 py-8">
      <h1 className="text-2xl font-semibold">{categoria.nome}</h1>
      <div className="flex flex-wrap gap-4">
        {lista.map((aula) => (
          <AulaCard key={aula.id} aula={aula} liberada={liberacao.get(aula.id) ?? true} />
        ))}
        {lista.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma aula nesta categoria ainda.</p>
        )}
      </div>
    </div>
  )
}
