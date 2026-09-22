'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function salvarAula(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const categoriaId = String(formData.get('categoria_id') ?? '')
  const titulo = String(formData.get('titulo') ?? '')
  const descricao = String(formData.get('descricao') ?? '')
  const youtubeUrl = String(formData.get('youtube_url') ?? '')
  const ordem = Number(formData.get('ordem') ?? 0)

  const supabase = await createClient()

  const payload = {
    categoria_id: categoriaId,
    titulo,
    descricao: descricao || null,
    youtube_url: youtubeUrl,
    ordem,
  }

  const { error } = id
    ? await supabase.from('aulas').update(payload).eq('id', id)
    : await supabase.from('aulas').insert(payload)

  if (error) {
    redirect(`/admin/aulas/${id || 'novo'}?erro=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/aulas')
  redirect('/admin/aulas')
}

export async function excluirAula(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const supabase = await createClient()
  await supabase.from('aulas').delete().eq('id', id)
  revalidatePath('/admin/aulas')
  redirect('/admin/aulas')
}
