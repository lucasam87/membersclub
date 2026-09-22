import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AulaForm } from '@/components/admin/AulaForm'
import type { Tables } from '@/types/database'

export default async function AulaEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ erro?: string }>
}) {
  const { id } = await params
  const { erro } = await searchParams
  const supabase = await createClient()

  const { data: categorias } = await supabase.from('categorias').select('*').order('ordem')
  const listaCategorias = (categorias ?? []) as Tables<'categorias'>[]

  if (id === 'novo') {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Nova aula</h1>
        <AulaForm categorias={listaCategorias} erro={erro} />
      </div>
    )
  }

  const { data: aula } = await supabase.from('aulas').select('*').eq('id', id).single()
  if (!aula) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar aula</h1>
      <AulaForm aula={aula as Tables<'aulas'>} categorias={listaCategorias} erro={erro} />
    </div>
  )
}
