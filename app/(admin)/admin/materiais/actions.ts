'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getUser } from '@/lib/auth/session'

// O upload usa o client com service role (bypassa RLS de storage), entao
// esta action precisa validar admin explicitamente (ver mesma nota em
// app/(admin)/admin/banner/actions.ts).
async function assertAdmin() {
  const usuario = await getUser()
  if (!usuario || usuario.papel !== 'admin') {
    throw new Error('Acesso restrito a administradores.')
  }
}

export async function salvarMaterial(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') ?? '')
  const aulaId = String(formData.get('aula_id') ?? '')
  const tipo = String(formData.get('tipo') ?? '')
  const arquivo = formData.get('arquivo') as File | null

  const supabase = await createClient()
  let caminhoArquivo = String(formData.get('url_arquivo_atual') ?? '')
  let nomeArquivo = String(formData.get('nome_arquivo_atual') ?? '')

  if (arquivo && arquivo.size > 0) {
    const service = createServiceClient()
    const caminho = `${aulaId}/${crypto.randomUUID()}-${arquivo.name}`
    const { error: uploadError } = await service.storage
      .from('materiais')
      .upload(caminho, arquivo, { contentType: arquivo.type })

    if (uploadError) {
      redirect(`/admin/materiais/${id || 'novo'}?erro=${encodeURIComponent(uploadError.message)}`)
    }

    caminhoArquivo = caminho
    nomeArquivo = arquivo.name
  }

  if (!caminhoArquivo || !nomeArquivo) {
    redirect(`/admin/materiais/${id || 'novo'}?erro=${encodeURIComponent('Selecione um arquivo.')}`)
  }

  const payload = {
    aula_id: aulaId,
    nome_arquivo: nomeArquivo,
    url_arquivo: caminhoArquivo,
    tipo: tipo || null,
  }

  const { error } = id
    ? await supabase.from('materiais').update(payload).eq('id', id)
    : await supabase.from('materiais').insert(payload)

  if (error) {
    redirect(`/admin/materiais/${id || 'novo'}?erro=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/materiais')
  redirect('/admin/materiais')
}

export async function excluirMaterial(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') ?? '')
  const supabase = await createClient()
  await supabase.from('materiais').delete().eq('id', id)
  revalidatePath('/admin/materiais')
  redirect('/admin/materiais')
}
