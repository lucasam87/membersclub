import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/DataTable'
import type { Tables } from '@/types/database'

export default async function BannerAdminPage() {
  const supabase = await createClient()
  const { data: banners } = await supabase.from('banner').select('*').order('ordem')
  const items = (banners ?? []) as Tables<'banner'>[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Banner</h1>
        <Button render={<Link href="/admin/banner/novo">Novo banner</Link>} nativeButton={false} />
      </div>
      <DataTable
        items={items}
        editHref={(item) => `/admin/banner/${item.id}`}
        colunas={[
          { header: 'Titulo', render: (item) => item.titulo },
          { header: 'Ativo', render: (item) => (item.ativo ? 'Sim' : 'Nao') },
          { header: 'Ordem', render: (item) => item.ordem },
        ]}
      />
    </div>
  )
}
