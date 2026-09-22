import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/session'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'

const STATUS_LABEL: Record<string, string> = {
  ativo: 'Ativa',
  atrasado: 'Atrasada',
  bloqueado: 'Bloqueada',
  pendente: 'Pendente',
}

const STATUS_VARIANT: Record<string, 'default' | 'destructive' | 'secondary'> = {
  ativo: 'default',
  atrasado: 'secondary',
  bloqueado: 'destructive',
  pendente: 'secondary',
}

export default async function AssinaturaPage() {
  const usuario = await getUser()
  if (!usuario) redirect('/login')

  const supabase = await createClient()
  const { data: assinatura } = await supabase
    .from('assinaturas')
    .select('*')
    .eq('usuario_id', usuario.id)
    .order('data_vencimento', { ascending: false })
    .limit(1)
    .maybeSingle()

  const status = assinatura?.status ?? usuario.status_assinatura

  return (
    <div className="mx-auto max-w-md space-y-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">Assinatura</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            Status
            <Badge variant={STATUS_VARIANT[status] ?? 'secondary'}>
              {STATUS_LABEL[status] ?? status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {assinatura?.data_vencimento && (
            <p>
              Proximo vencimento:{' '}
              {new Date(assinatura.data_vencimento).toLocaleDateString('pt-BR')}
            </p>
          )}
          <p>
            O pagamento recorrente via Pix ainda esta em integracao. Assim que o gateway for
            definido, esta pagina passara a mostrar cobrancas e permitir renovacao por aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
