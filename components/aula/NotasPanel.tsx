import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { NotaPessoalForm } from '@/components/aula/NotaPessoalForm'

export async function NotasPanel({ aulaId }: { aulaId: string }) {
  const usuario = await getUser()
  if (!usuario) return null

  const supabase = await createClient()

  const [{ data: notaPessoal }, { data: quiz }] = await Promise.all([
    supabase
      .from('notas_pessoais')
      .select('conteudo')
      .eq('aula_id', aulaId)
      .eq('usuario_id', usuario.id)
      .maybeSingle(),
    supabase.from('quizzes').select('id').eq('aula_id', aulaId).maybeSingle(),
  ])

  let ultimaNota: number | null = null
  if (quiz) {
    const { data: tentativa } = await supabase
      .from('quiz_tentativas')
      .select('nota')
      .eq('quiz_id', quiz.id)
      .eq('usuario_id', usuario.id)
      .order('criado_em', { ascending: false })
      .limit(1)
      .maybeSingle()
    ultimaNota = tentativa?.nota ?? null
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">Notas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Minhas notas</p>
          <NotaPessoalForm aulaId={aulaId} conteudoInicial={notaPessoal?.conteudo ?? ''} />
        </div>
        {quiz && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Nota de desempenho</p>
            <p className="text-sm">{ultimaNota === null ? '—' : ultimaNota.toFixed(0)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
