import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { mapaLiberacao } from '@/lib/progresso/regras'
import { AulaCard } from '@/components/catalogo/AulaCard'
import { BuscaInput } from '@/components/catalogo/BuscaInput'

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const supabase = await createClient()
  const usuario = await getUser()

  const termo = q.trim()
  // Remove caracteres reservados da gramatica de filtros do PostgREST
  // (`,`, `(`, `)`) para que o termo de busca nao seja interpretado como
  // sintaxe de filtro dentro do .or().
  const termoSeguro = termo.replace(/[,()]/g, ' ').trim()
  const { data: aulas } = termoSeguro
    ? await supabase
        .from('aulas')
        .select('id, titulo, youtube_url, categoria_id, ordem')
        .or(`titulo.ilike.%${termoSeguro}%,descricao.ilike.%${termoSeguro}%`)
        .order('ordem')
    : { data: [] }

  const lista = aulas ?? []
  const liberacao = await mapaLiberacao(supabase, usuario?.id, lista)

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="max-w-md">
        <BuscaInput valorInicial={termo} />
      </div>

      {termo && (
        <p className="text-sm text-muted-foreground">
          {lista.length} resultado(s) para &ldquo;{termo}&rdquo;
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        {lista.map((aula) => (
          <AulaCard key={aula.id} aula={aula} liberada={liberacao.get(aula.id) ?? true} />
        ))}
      </div>
    </div>
  )
}
