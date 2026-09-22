import { notFound } from 'next/navigation'
import { Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { isAulaLiberada } from '@/lib/progresso/regras'
import { AulaLayout } from '@/components/aula/AulaLayout'
import { CategoriaNav } from '@/components/aula/CategoriaNav'
import { YoutubeEmbed } from '@/components/aula/YoutubeEmbed'
import { QuizPanel } from '@/components/aula/QuizPanel'
import { NotasPanel } from '@/components/aula/NotasPanel'
import { MateriaisPanel } from '@/components/aula/MateriaisPanel'

export default async function AulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const usuario = await getUser()

  const { data: aula } = await supabase.from('aulas').select('*').eq('id', id).single()
  if (!aula) notFound()

  // Bloqueio sequencial: sem isso, um aluno poderia acessar a URL da aula
  // diretamente e pular o quiz da aula anterior na mesma subcategoria.
  const { data: irmas } = await supabase
    .from('aulas')
    .select('id, ordem')
    .eq('categoria_id', aula.categoria_id)
  const minOrdem = Math.min(...(irmas ?? [aula]).map((a) => a.ordem))

  const { data: progresso } = usuario
    ? await supabase
        .from('progresso_aluno')
        .select('liberada')
        .eq('usuario_id', usuario.id)
        .eq('aula_id', aula.id)
        .maybeSingle()
    : { data: null }

  const liberada = isAulaLiberada(aula, minOrdem, progresso)

  if (!liberada) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
        <Lock className="size-8 text-muted-foreground" />
        <h1 className="text-lg font-semibold">Aula bloqueada</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Conclua a aula anterior desta subcategoria para liberar este conteudo.
        </p>
      </div>
    )
  }

  return (
    <AulaLayout
      nav={<CategoriaNav aulaAtualId={aula.id} />}
      video={
        <div className="space-y-4">
          <YoutubeEmbed youtubeUrl={aula.youtube_url} titulo={aula.titulo} />
          <div>
            <h1 className="text-xl font-semibold">{aula.titulo}</h1>
            {aula.descricao && (
              <p className="mt-1 text-sm text-muted-foreground">{aula.descricao}</p>
            )}
          </div>
        </div>
      }
      painel={
        <div className="divide-y divide-border">
          <QuizPanel aulaId={aula.id} />
          <NotasPanel aulaId={aula.id} />
          <MateriaisPanel aulaId={aula.id} />
        </div>
      }
    />
  )
}
