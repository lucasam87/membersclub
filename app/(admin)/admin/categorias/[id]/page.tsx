import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CategoriaForm } from '@/components/admin/CategoriaForm'
import type { Tables } from '@/types/database'

export default async function CategoriaEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ erro?: string; pai?: string }>
}) {
  const { id } = await params
  const { erro, pai } = await searchParams
  const supabase = await createClient()

  const { data: categorias } = await supabase.from('categorias').select('*').order('ordem')
  const lista = (categorias ?? []) as Tables<'categorias'>[]

  if (id === 'novo') {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Nova categoria</h1>
        <CategoriaForm categorias={lista} paiPadrao={pai} erro={erro} />
      </div>
    )
  }

  const categoria = lista.find((c) => c.id === id)
  if (!categoria) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar categoria</h1>
      <CategoriaForm categoria={categoria} categorias={lista} erro={erro} />
    </div>
  )
}
