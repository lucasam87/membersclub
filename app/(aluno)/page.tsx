import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { mapaLiberacao } from '@/lib/progresso/regras'
import { Banner } from '@/components/catalogo/Banner'
import { CategoriaRow } from '@/components/catalogo/CategoriaRow'
import type { Tables } from '@/types/database'

export default async function HomePage() {
  const supabase = await createClient()
  const usuario = await getUser()

  const [{ data: banners }, { data: categorias }] = await Promise.all([
    supabase.from('banner').select('*').eq('ativo', true).order('ordem').limit(1),
    supabase.from('categorias').select('*').is('categoria_pai_id', null).order('ordem'),
  ])

  const categoriasRaiz = (categorias ?? []) as Tables<'categorias'>[]

  const linhas = await Promise.all(
    categoriasRaiz.map(async (categoria) => {
      const { data: aulas } = await supabase
        .from('aulas')
        .select('id, titulo, youtube_url, categoria_id, ordem')
        .eq('categoria_id', categoria.id)
        .order('ordem')
        .limit(15)

      return { categoria, aulas: aulas ?? [] }
    })
  )

  const liberacao = await mapaLiberacao(
    supabase,
    usuario?.id,
    linhas.flatMap((l) => l.aulas)
  )

  return (
    <div className="space-y-8 pb-12">
      {banners?.[0] && <Banner banner={banners[0] as Tables<'banner'>} />}

      <div className="space-y-8">
        {linhas.map(({ categoria, aulas }) => (
          <CategoriaRow key={categoria.id} categoria={categoria} aulas={aulas} liberacao={liberacao} />
        ))}
        {linhas.every((l) => l.aulas.length === 0) && (
          <p className="px-6 text-sm text-muted-foreground">
            Nenhum conteudo publicado ainda. Volte em breve.
          </p>
        )}
      </div>
    </div>
  )
}
