import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { marcarAulaConcluida } from '@/lib/progresso/actions'
import { QuizForm } from '@/components/aula/QuizForm'

export async function QuizPanel({ aulaId }: { aulaId: string }) {
  const usuario = await getUser()
  const supabase = await createClient()

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*')
    .eq('aula_id', aulaId)
    .maybeSingle()

  if (!usuario) return null

  const { data: progresso } = await supabase
    .from('progresso_aluno')
    .select('concluida')
    .eq('aula_id', aulaId)
    .eq('usuario_id', usuario.id)
    .maybeSingle()

  if (!quiz) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Esta aula nao possui quiz.</p>
          {progresso?.concluida ? (
            <p className="text-sm font-medium">Aula concluida.</p>
          ) : (
            <form action={marcarAulaConcluida}>
              <input type="hidden" name="aula_id" value={aulaId} />
              <Button type="submit" size="sm">
                Marcar como concluida
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    )
  }

  const [{ data: perguntas }, { data: alternativas }, { count: tentativasUsadas }] =
    await Promise.all([
      supabase
        .from('quiz_perguntas')
        .select('id, enunciado, ordem')
        .eq('quiz_id', quiz.id)
        .order('ordem'),
      supabase.rpc('quiz_alternativas_do_quiz', { p_quiz_id: quiz.id }),
      supabase
        .from('quiz_tentativas')
        .select('id', { count: 'exact', head: true })
        .eq('quiz_id', quiz.id)
        .eq('usuario_id', usuario.id),
    ])

  const perguntasComAlternativas = (perguntas ?? []).map((p) => ({
    id: p.id,
    enunciado: p.enunciado,
    alternativas: (alternativas ?? []).filter((a) => a.pergunta_id === p.id),
  }))

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {progresso?.concluida ? (
          <p className="text-sm font-medium">Aula concluida.</p>
        ) : (
          <QuizForm
            quizId={quiz.id}
            perguntas={perguntasComAlternativas}
            notaMinima={quiz.nota_minima}
            tentativasRestantesInicial={Math.max(
              0,
              quiz.max_tentativas - (tentativasUsadas ?? 0)
            )}
          />
        )}
      </CardContent>
    </Card>
  )
}
