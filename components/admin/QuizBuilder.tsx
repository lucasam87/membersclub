import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  adicionarPergunta,
  excluirPergunta,
  adicionarAlternativa,
  excluirAlternativa,
  marcarAlternativaCorreta,
} from '@/app/(admin)/admin/quizzes/actions'

type Alternativa = { id: string; texto: string; correta: boolean }
type Pergunta = { id: string; enunciado: string; ordem: number; alternativas: Alternativa[] }

export function QuizBuilder({ quizId, perguntas }: { quizId: string; perguntas: Pergunta[] }) {
  return (
    <div className="space-y-6">
      {perguntas.map((pergunta, i) => (
        <div key={pergunta.id} className="space-y-3 rounded-md border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">
              {i + 1}. {pergunta.enunciado}
            </p>
            <form action={excluirPergunta}>
              <input type="hidden" name="pergunta_id" value={pergunta.id} />
              <input type="hidden" name="quiz_id" value={quizId} />
              <Button type="submit" variant="ghost" size="sm">
                Excluir pergunta
              </Button>
            </form>
          </div>

          <ul className="space-y-1">
            {pergunta.alternativas.map((alt) => (
              <li key={alt.id} className="flex items-center gap-2 text-sm">
                <form action={marcarAlternativaCorreta}>
                  <input type="hidden" name="alternativa_id" value={alt.id} />
                  <input type="hidden" name="pergunta_id" value={pergunta.id} />
                  <input type="hidden" name="quiz_id" value={quizId} />
                  <button
                    type="submit"
                    aria-label="Marcar como correta"
                    className={
                      alt.correta
                        ? 'size-3.5 shrink-0 rounded-full bg-primary'
                        : 'size-3.5 shrink-0 rounded-full border border-input'
                    }
                  />
                </form>
                <span className={alt.correta ? 'font-medium' : undefined}>{alt.texto}</span>
                <form action={excluirAlternativa} className="ml-auto">
                  <input type="hidden" name="alternativa_id" value={alt.id} />
                  <input type="hidden" name="quiz_id" value={quizId} />
                  <Button type="submit" variant="ghost" size="xs">
                    Remover
                  </Button>
                </form>
              </li>
            ))}
          </ul>

          <form action={adicionarAlternativa} className="flex items-center gap-2">
            <input type="hidden" name="pergunta_id" value={pergunta.id} />
            <input type="hidden" name="quiz_id" value={quizId} />
            <Input name="texto" placeholder="Nova alternativa" required className="h-8" />
            <label className="flex items-center gap-1 text-xs text-muted-foreground">
              <input type="checkbox" name="correta" className="size-3.5" />
              Correta
            </label>
            <Button type="submit" size="sm" variant="outline">
              Adicionar
            </Button>
          </form>
        </div>
      ))}

      <form action={adicionarPergunta} className="flex items-center gap-2">
        <input type="hidden" name="quiz_id" value={quizId} />
        <input type="hidden" name="ordem" value={perguntas.length} />
        <Input name="enunciado" placeholder="Nova pergunta" required />
        <Button type="submit" variant="outline">
          Adicionar pergunta
        </Button>
      </form>
    </div>
  )
}
