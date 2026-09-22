'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { liberarProximaAula } from '@/lib/progresso/regras'

export async function marcarAulaConcluida(formData: FormData) {
  const aulaId = String(formData.get('aula_id') ?? '')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  // So' permite marcar como concluida se a aula NAO tiver quiz — caso
  // contrario o aluno poderia pular a avaliacao chamando esta action direto.
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id')
    .eq('aula_id', aulaId)
    .maybeSingle()

  if (quiz) return

  const service = createServiceClient()
  await liberarProximaAula(service, user.id, aulaId)
  revalidatePath(`/aula/${aulaId}`)
}
