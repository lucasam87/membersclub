import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MaterialForm } from '@/components/admin/MaterialForm'
import type { Tables } from '@/types/database'

export default async function MaterialEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ erro?: string }>
}) {
  const { id } = await params
  const { erro } = await searchParams
  const supabase = await createClient()

  const { data: aulas } = await supabase.from('aulas').select('*').order('ordem')
  const listaAulas = (aulas ?? []) as Tables<'aulas'>[]

  if (id === 'novo') {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Novo material</h1>
        <MaterialForm aulas={listaAulas} erro={erro} />
      </div>
    )
  }

  const { data: material } = await supabase.from('materiais').select('*').eq('id', id).single()
  if (!material) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar material</h1>
      <MaterialForm material={material} aulas={listaAulas} erro={erro} />
    </div>
  )
}
