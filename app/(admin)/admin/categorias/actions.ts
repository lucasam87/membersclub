'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function slugify(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function salvarCategoria(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const nome = String(formData.get('nome') ?? '')
  const categoriaPaiId = String(formData.get('categoria_pai_id') ?? '') || null

  const supabase = await createClient()

  const payload: { nome: string; slug: string; categoria_pai_id: string | null; ordem?: number } = {
    nome,
    slug: slugify(nome),
    categoria_pai_id: categoriaPaiId,
  }

  // A ordem e' definida por drag-and-drop na listagem (ver reordenarCategorias);
  // uma categoria nova entra no fim dos irmaos do mesmo pai.
  if (!id) {
    const irmaos = supabase.from('categorias').select('id', { count: 'exact', head: true })
    const { count } = categoriaPaiId
      ? await irmaos.eq('categoria_pai_id', categoriaPaiId)
      : await irmaos.is('categoria_pai_id', null)
    payload.ordem = count ?? 0
  }

  // RLS (categorias_admin_write) garante que so' admin escreve, mesmo se este
  // check de papel na UI tiver algum bug.
  const { error } = id
    ? await supabase.from('categorias').update(payload).eq('id', id)
    : await supabase.from('categorias').insert(payload)

  if (error) {
    redirect(
      `/admin/categorias/${id || 'novo'}?erro=${encodeURIComponent(error.message)}`
    )
  }

  revalidatePath('/admin/categorias')
  redirect('/admin/categorias')
}

export async function excluirCategoria(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const supabase = await createClient()
  await supabase.from('categorias').delete().eq('id', id)
  revalidatePath('/admin/categorias')
  redirect('/admin/categorias')
}

type Atualizacao = { id: string; categoria_pai_id: string | null; ordem: number }

// Usado pelo drag-and-drop da arvore de categorias: recebe so' os itens cuja
// ordem/pai mudaram (nao a lista inteira) e aplica em lote.
export async function reordenarCategorias(atualizacoes: Atualizacao[]) {
  const supabase = await createClient()

  const resultados = await Promise.all(
    atualizacoes.map(({ id, categoria_pai_id, ordem }) =>
      supabase.from('categorias').update({ categoria_pai_id, ordem }).eq('id', id)
    )
  )

  const erro = resultados.find((r) => r.error)?.error
  if (erro) {
    return { erro: erro.message }
  }

  revalidatePath('/admin/categorias')
  return { erro: null }
}
