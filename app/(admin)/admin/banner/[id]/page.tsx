import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BannerForm } from '@/components/admin/BannerForm'

export default async function BannerEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ erro?: string }>
}) {
  const { id } = await params
  const { erro } = await searchParams

  if (id === 'novo') {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Novo banner</h1>
        <BannerForm erro={erro} />
      </div>
    )
  }

  const supabase = await createClient()
  const { data: banner } = await supabase.from('banner').select('*').eq('id', id).single()
  if (!banner) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar banner</h1>
      <BannerForm banner={banner} erro={erro} />
    </div>
  )
}
