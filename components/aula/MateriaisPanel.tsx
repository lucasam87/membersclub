import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { FileText } from 'lucide-react'

export async function MateriaisPanel({ aulaId }: { aulaId: string }) {
  const supabase = await createClient()
  const { data: materiais } = await supabase
    .from('materiais')
    .select('*')
    .eq('aula_id', aulaId)

  const lista = materiais ?? []
  if (lista.length === 0) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Materiais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum material anexado a esta aula.</p>
        </CardContent>
      </Card>
    )
  }

  // Bucket 'materiais' e' privado; URLs assinadas so' podem ser geradas com
  // service role (ver storage policy em 0007_storage_materiais.sql).
  const service = createServiceClient()
  const materiaisComUrl = await Promise.all(
    lista.map(async (material) => {
      const { data } = await service.storage
        .from('materiais')
        .createSignedUrl(material.url_arquivo, 60 * 5)
      return { ...material, urlAssinada: data?.signedUrl ?? null }
    })
  )

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">Materiais</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {materiaisComUrl.map((material) => (
            <li key={material.id}>
              {material.urlAssinada ? (
                <a
                  href={material.urlAssinada}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileText className="size-4 shrink-0" />
                  {material.nome_arquivo}
                </a>
              ) : (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="size-4 shrink-0" />
                  {material.nome_arquivo} (indisponivel)
                </span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
