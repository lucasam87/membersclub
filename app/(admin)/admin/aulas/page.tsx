import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/DataTable'
import type { Tables } from '@/types/database'

export default async function AulasAdminPage() {
  const supabase = await createClient()
  const [{ data: aulas }, { data: categorias }] = await Promise.all([
    supabase.from('aulas').select('*').order('ordem'),
    supabase.from('categorias').select('*'),
  ])

  const items = (aulas ?? []) as Tables<'aulas'>[]
  const nomePorCategoria = new Map(
    ((categorias ?? []) as Tables<'categorias'>[]).map((c) => [c.id, c.nome])
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Aulas</h1>
        <Button render={<Link href="/admin/aulas/novo">Nova aula</Link>} nativeButton={false} />
      </div>
      <DataTable
        items={items}
        editHref={(item) => `/admin/aulas/${item.id}`}
        colunas={[
          { header: 'Titulo', render: (item) => item.titulo },
          {
            header: 'Categoria',
            render: (item) => nomePorCategoria.get(item.categoria_id) ?? '—',
          },
          { header: 'Ordem', render: (item) => item.ordem },
        ]}
      />
    </div>
  )
}
