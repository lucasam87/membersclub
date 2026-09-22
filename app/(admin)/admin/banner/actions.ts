'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getUser } from '@/lib/auth/session'

// O upload usa o client com service role (bypassa RLS de storage), entao
// esta action precisa validar admin explicitamente — nao pode depender so'
// do guard de pagina em app/(admin)/layout.tsx, pois Server Actions sao
// endpoints proprios e continuam alcancaveis mesmo se o proxy/layout mudar.
async function assertAdmin() {
  const usuario = await getUser()
  if (!usuario || usuario.papel !== 'admin') {
    throw new Error('Acesso restrito a administradores.')
  }
}

export async function salvarBanner(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') ?? '')
  const titulo = String(formData.get('titulo') ?? '')
  const linkDestino = String(formData.get('link_destino') ?? '')
  const ativo = formData.get('ativo') === 'on'
  const ordem = Number(formData.get('ordem') ?? 0)
  const imagem = formData.get('imagem') as File | null

  const supabase = await createClient()
  let imagemUrl = String(formData.get('imagem_url_atual') ?? '')

  if (imagem && imagem.size > 0) {
    const service = createServiceClient()
    const caminho = `${crypto.randomUUID()}-${imagem.name}`
    const { error: uploadError } = await service.storage
      .from('banner')
      .upload(caminho, imagem, { contentType: imagem.type })

    if (uploadError) {
      redirect(`/admin/banner/${id || 'novo'}?erro=${encodeURIComponent(uploadError.message)}`)
    }

    const { data: publicUrl } = service.storage.from('banner').getPublicUrl(caminho)
    imagemUrl = publicUrl.publicUrl
  }

  if (!imagemUrl) {
    redirect(`/admin/banner/${id || 'novo'}?erro=${encodeURIComponent('Selecione uma imagem.')}`)
  }

  const payload = { titulo, link_destino: linkDestino || null, ativo, ordem, imagem_url: imagemUrl }

  const { error } = id
    ? await supabase.from('banner').update(payload).eq('id', id)
    : await supabase.from('banner').insert(payload)

  if (error) {
    redirect(`/admin/banner/${id || 'novo'}?erro=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/banner')
  revalidatePath('/')
  redirect('/admin/banner')
}

export async function excluirBanner(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') ?? '')
  const supabase = await createClient()
  await supabase.from('banner').delete().eq('id', id)
  revalidatePath('/admin/banner')
  revalidatePath('/')
  redirect('/admin/banner')
}
