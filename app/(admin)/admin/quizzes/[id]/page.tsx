import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuizMetaForm } from '@/components/admin/QuizMetaForm'
import { QuizBuilder } from '@/components/admin/QuizBuilder'
import type { Tables } from '@/types/database'

export default async function QuizEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ erro?: string }>
}) {
  const { id } = await params
  const { erro } = await searchParams
  const supabase = await createClient()

  if (id === 'novo') {
    const [{ data: aulas }, { data: quizzes }] = await Promise.all([
      supabase.from('aulas').select('*').order('titulo'),
      supabase.from('quizzes').select('aula_id'),
    ])
    const aulasComQuiz = new Set((quizzes ?? []).map((q) => q.aula_id))
    const aulasDisponiveis = ((aulas ?? []) as Tables<'aulas'>[]).filter(
      (a) => !aulasComQuiz.has(a.id)
    )

    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Novo quiz</h1>
        <QuizMetaForm aulasDisponiveis={aulasDisponiveis} erro={erro} />
      </div>
    )
  }

  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', id).single()
  if (!quiz) notFound()

  const { data: perguntas } = await supabase
    .from('quiz_perguntas')
    .select('*, quiz_alternativas(*)')
    .eq('quiz_id', id)
    .order('ordem')

  const perguntasFormatadas = (perguntas ?? []).map((p) => ({
    id: p.id,
    enunciado: p.enunciado,
    ordem: p.ordem,
    alternativas: (p.quiz_alternativas ?? []) as Tables<'quiz_alternativas'>[],
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-xl font-semibold">Editar quiz</h1>
        <QuizMetaForm quiz={quiz} aulasDisponiveis={[]} erro={erro} />
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Perguntas</h2>
        <QuizBuilder quizId={quiz.id} perguntas={perguntasFormatadas} />
      </div>
    </div>
  )
}
