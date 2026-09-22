import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { liberarProximaAula } from '@/lib/progresso/regras'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const quizId = typeof body?.quizId === 'string' ? body.quizId : null
  const respostas = (body?.respostas ?? {}) as Record<string, string>

  if (!quizId) {
    return NextResponse.json({ error: 'quizId invalido' }, { status: 400 })
  }

  // O client do proprio usuario basta aqui: quizzes e' select-auth (nao
  // sensivel) e quiz_tentativas so' pode ser lida (nao escrita) pelo dono.
  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', quizId).single()
  if (!quiz) {
    return NextResponse.json({ error: 'Quiz nao encontrado' }, { status: 404 })
  }

  const { count: tentativasUsadas } = await supabase
    .from('quiz_tentativas')
    .select('id', { count: 'exact', head: true })
    .eq('quiz_id', quizId)
    .eq('usuario_id', user.id)

  const usadas = tentativasUsadas ?? 0
  if (usadas >= quiz.max_tentativas) {
    return NextResponse.json({ error: 'Tentativas esgotadas' }, { status: 403 })
  }

  // Correcao e escrita de progresso exigem o client com service role: a
  // tabela quiz_alternativas so' e' legivel por admin via RLS (para nao
  // vazar `correta` ao aluno) e quiz_tentativas/progresso_aluno so' aceitam
  // escrita de admin/service role (para o aluno nao poder forjar resultado
  // ou liberar aulas direto via REST). Ja' validamos a identidade do
  // usuario acima via cookie de sessao, entao e' seguro elevar aqui.
  const service = createServiceClient()

  const { data: perguntas } = await service
    .from('quiz_perguntas')
    .select('id, quiz_alternativas(id, correta)')
    .eq('quiz_id', quizId)

  const lista = perguntas ?? []
  let corretas = 0
  for (const pergunta of lista) {
    const alternativas = pergunta.quiz_alternativas as { id: string; correta: boolean }[]
    const alternativaCorreta = alternativas.find((a) => a.correta)
    const escolhida = respostas[pergunta.id]
    if (escolhida && alternativaCorreta && escolhida === alternativaCorreta.id) {
      corretas++
    }
  }

  const nota = lista.length > 0 ? (corretas / lista.length) * 100 : 0
  const aprovado = nota >= quiz.nota_minima

  await service.from('quiz_tentativas').insert({
    quiz_id: quizId,
    usuario_id: user.id,
    nota,
    aprovado,
  })

  if (aprovado) {
    await liberarProximaAula(service, user.id, quiz.aula_id)
  }

  return NextResponse.json({
    nota,
    aprovado,
    tentativasRestantes: Math.max(0, quiz.max_tentativas - usadas - 1),
  })
}
