'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Todas as escritas aqui passam pelo client normal do usuario: RLS
// (is_admin()) e' quem garante que so' admin consegue gravar, entao nao e'
// preciso checagem explicita de papel (diferente das actions de upload em
// banner/materiais, que usam service role e por isso bypassam RLS).

export async function salvarQuiz(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const aulaId = String(formData.get('aula_id') ?? '')
  const notaMinima = Number(formData.get('nota_minima') ?? 70)
  const maxTentativas = Number(formData.get('max_tentativas') ?? 3)

  const supabase = await createClient()
  const payload = { aula_id: aulaId, nota_minima: notaMinima, max_tentativas: maxTentativas }

  const { data, error } = id
    ? await supabase.from('quizzes').update(payload).eq('id', id).select('id').single()
    : await supabase.from('quizzes').insert(payload).select('id').single()

  if (error) {
    redirect(`/admin/quizzes/${id || 'novo'}?erro=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/quizzes')
  redirect(`/admin/quizzes/${data.id}`)
}

export async function excluirQuiz(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const supabase = await createClient()
  await supabase.from('quizzes').delete().eq('id', id)
  revalidatePath('/admin/quizzes')
  redirect('/admin/quizzes')
}

export async function adicionarPergunta(formData: FormData) {
  const quizId = String(formData.get('quiz_id') ?? '')
  const enunciado = String(formData.get('enunciado') ?? '')
  const ordem = Number(formData.get('ordem') ?? 0)

  const supabase = await createClient()
  await supabase.from('quiz_perguntas').insert({ quiz_id: quizId, enunciado, ordem })
  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function excluirPergunta(formData: FormData) {
  const perguntaId = String(formData.get('pergunta_id') ?? '')
  const quizId = String(formData.get('quiz_id') ?? '')
  const supabase = await createClient()
  await supabase.from('quiz_perguntas').delete().eq('id', perguntaId)
  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function adicionarAlternativa(formData: FormData) {
  const perguntaId = String(formData.get('pergunta_id') ?? '')
  const quizId = String(formData.get('quiz_id') ?? '')
  const texto = String(formData.get('texto') ?? '')
  const correta = formData.get('correta') === 'on'

  const supabase = await createClient()
  await supabase.from('quiz_alternativas').insert({ pergunta_id: perguntaId, texto, correta })
  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function excluirAlternativa(formData: FormData) {
  const alternativaId = String(formData.get('alternativa_id') ?? '')
  const quizId = String(formData.get('quiz_id') ?? '')
  const supabase = await createClient()
  await supabase.from('quiz_alternativas').delete().eq('id', alternativaId)
  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function marcarAlternativaCorreta(formData: FormData) {
  const alternativaId = String(formData.get('alternativa_id') ?? '')
  const perguntaId = String(formData.get('pergunta_id') ?? '')
  const quizId = String(formData.get('quiz_id') ?? '')

  const supabase = await createClient()
  // Uma unica alternativa correta por pergunta: zera as demais antes de marcar.
  await supabase.from('quiz_alternativas').update({ correta: false }).eq('pergunta_id', perguntaId)
  await supabase.from('quiz_alternativas').update({ correta: true }).eq('id', alternativaId)
  revalidatePath(`/admin/quizzes/${quizId}`)
}
