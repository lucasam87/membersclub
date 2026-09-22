import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export type UsuarioSessao = Pick<
  Tables<'usuarios'>,
  'id' | 'nome' | 'email' | 'papel' | 'status_assinatura'
>

export async function getUser(): Promise<UsuarioSessao | null> {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id, nome, email, papel, status_assinatura')
    .eq('id', authUser.id)
    .single()

  return usuario ?? null

  // TODO(fase4-followup): quando a integracao Pix estiver pronta, bloquear
  // acesso aqui quando status_assinatura === 'bloqueado' (redirect('/assinatura')),
  // aplicado no layout de app/(aluno)/.
}
