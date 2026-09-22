import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { salvarAula, excluirAula } from '@/app/(admin)/admin/aulas/actions'
import type { Tables } from '@/types/database'

export function AulaForm({
  aula,
  categorias,
  erro,
}: {
  aula?: Tables<'aulas'>
  categorias: Tables<'categorias'>[]
  erro?: string
}) {
  return (
    <div className="max-w-md space-y-4">
      <form action={salvarAula} className="space-y-4">
        {aula && <input type="hidden" name="id" value={aula.id} />}

        <div className="space-y-2">
          <Label htmlFor="titulo">Titulo</Label>
          <Input id="titulo" name="titulo" defaultValue={aula?.titulo} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria_id">Categoria</Label>
          <select
            id="categoria_id"
            name="categoria_id"
            defaultValue={aula?.categoria_id ?? ''}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
          >
            <option value="" disabled>
              Selecione...
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube_url">Link do YouTube</Label>
          <Input
            id="youtube_url"
            name="youtube_url"
            type="url"
            defaultValue={aula?.youtube_url}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descricao</Label>
          <Textarea id="descricao" name="descricao" defaultValue={aula?.descricao ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ordem">Ordem</Label>
          <Input id="ordem" name="ordem" type="number" defaultValue={aula?.ordem ?? 0} required />
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit">Salvar</Button>
      </form>

      {aula && (
        <form action={excluirAula}>
          <input type="hidden" name="id" value={aula.id} />
          <Button type="submit" variant="destructive">
            Excluir
          </Button>
        </form>
      )}
    </div>
  )
}
