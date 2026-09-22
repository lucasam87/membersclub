import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { salvarMaterial, excluirMaterial } from '@/app/(admin)/admin/materiais/actions'
import type { Tables } from '@/types/database'

export function MaterialForm({
  material,
  aulas,
  erro,
}: {
  material?: Tables<'materiais'>
  aulas: Tables<'aulas'>[]
  erro?: string
}) {
  return (
    <div className="max-w-md space-y-4">
      <form action={salvarMaterial} className="space-y-4">
        {material && <input type="hidden" name="id" value={material.id} />}
        <input type="hidden" name="url_arquivo_atual" value={material?.url_arquivo ?? ''} />
        <input type="hidden" name="nome_arquivo_atual" value={material?.nome_arquivo ?? ''} />

        <div className="space-y-2">
          <Label htmlFor="aula_id">Aula</Label>
          <select
            id="aula_id"
            name="aula_id"
            defaultValue={material?.aula_id ?? ''}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
          >
            <option value="" disabled>
              Selecione...
            </option>
            {aulas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="arquivo">
            Arquivo {material && '(deixe em branco para manter o atual)'}
          </Label>
          {material?.nome_arquivo && (
            <p className="text-xs text-muted-foreground">Atual: {material.nome_arquivo}</p>
          )}
          <Input id="arquivo" name="arquivo" type="file" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo (opcional)</Label>
          <Input id="tipo" name="tipo" placeholder="pdf, planilha, etc." defaultValue={material?.tipo ?? ''} />
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit">Salvar</Button>
      </form>

      {material && (
        <form action={excluirMaterial}>
          <input type="hidden" name="id" value={material.id} />
          <Button type="submit" variant="destructive">
            Excluir
          </Button>
        </form>
      )}
    </div>
  )
}
