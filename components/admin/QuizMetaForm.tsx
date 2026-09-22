import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { salvarQuiz, excluirQuiz } from '@/app/(admin)/admin/quizzes/actions'
import type { Tables } from '@/types/database'

export function QuizMetaForm({
  quiz,
  aulasDisponiveis,
  erro,
}: {
  quiz?: Tables<'quizzes'>
  aulasDisponiveis: Tables<'aulas'>[]
  erro?: string
}) {
  return (
    <div className="max-w-md space-y-4">
      <form action={salvarQuiz} className="space-y-4">
        {quiz && <input type="hidden" name="id" value={quiz.id} />}

        <div className="space-y-2">
          <Label htmlFor="aula_id">Aula</Label>
          {quiz ? (
            <p className="text-sm text-muted-foreground">
              Vinculado a uma aula (nao pode ser alterado).
            </p>
          ) : (
            <select
              id="aula_id"
              name="aula_id"
              defaultValue=""
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
            >
              <option value="" disabled>
                Selecione...
              </option>
              {aulasDisponiveis.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.titulo}
                </option>
              ))}
            </select>
          )}
          {quiz && <input type="hidden" name="aula_id" value={quiz.aula_id} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nota_minima">Nota minima (0-100)</Label>
          <Input
            id="nota_minima"
            name="nota_minima"
            type="number"
            min={0}
            max={100}
            defaultValue={quiz?.nota_minima ?? 70}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_tentativas">Maximo de tentativas</Label>
          <Input
            id="max_tentativas"
            name="max_tentativas"
            type="number"
            min={1}
            defaultValue={quiz?.max_tentativas ?? 3}
            required
          />
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit">Salvar</Button>
      </form>

      {quiz && (
        <form action={excluirQuiz}>
          <input type="hidden" name="id" value={quiz.id} />
          <Button type="submit" variant="destructive">
            Excluir quiz
          </Button>
        </form>
      )}
    </div>
  )
}
