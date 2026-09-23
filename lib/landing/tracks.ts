import { createServiceClient } from '@/lib/supabase/service'
import { landingConfig, type TrilhaExibicao } from '@/lib/landing/config'

// Busca as categorias raiz (trilhas) e conta aulas + subcategorias (modulos)
// direto no banco, para a secao publica de Trilhas. RLS restringe leitura de
// `categorias`/`aulas` a usuarios autenticados, entao usamos o client
// service-role (somente no servidor) para ler esses agregados sem exigir
// login. Se a consulta falhar ou nao houver categorias, cai no fallback
// estatico da config — nunca inventa numeros.
export async function getTrilhasVitrine(): Promise<TrilhaExibicao[]> {
  try {
    const supabase = createServiceClient()

    const { data: categoriasRaiz, error } = await supabase
      .from('categorias')
      .select('id, nome')
      .is('categoria_pai_id', null)
      .order('ordem')

    if (error || !categoriasRaiz || categoriasRaiz.length === 0) {
      return [...landingConfig.tracks]
    }

    const trilhas = await Promise.all(
      categoriasRaiz.map(async (categoria, index) => {
        const [{ count: numeroModulos }, { count: numeroAulas }] = await Promise.all([
          supabase
            .from('categorias')
            .select('id', { count: 'exact', head: true })
            .eq('categoria_pai_id', categoria.id),
          supabase
            .from('aulas')
            .select('id', { count: 'exact', head: true })
            .eq('categoria_id', categoria.id),
        ])

        const visual = landingConfig.tracks[index % landingConfig.tracks.length]

        return {
          nome: categoria.nome,
          glifo: visual.glifo,
          cor: visual.cor,
          glifoCor: visual.glifoCor,
          numeroAulas: numeroAulas ?? 0,
          numeroModulos: numeroModulos ?? 0,
        } satisfies TrilhaExibicao
      })
    )

    return trilhas
  } catch {
    return [...landingConfig.tracks]
  }
}
