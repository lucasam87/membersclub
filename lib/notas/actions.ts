'use server'

import { createClient } from '@/lib/supabase/server'

export async function salvarNotaPessoal(aulaId: string, conteudo: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Nao autenticado' }

  // RLS (notas_pessoais_owner) garante que so' o dono escreve seu proprio
  // registro; usuario_id vem da sessao, nunca do client.
  const { error } = await supabase
    .from('notas_pessoais')
    .upsert(
      { usuario_id: user.id, aula_id: aulaId, conteudo },
      { onConflict: 'usuario_id,aula_id' }
    )

  if (error) return { error: error.message }
  return { ok: true }
}
