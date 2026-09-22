import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/DataTable'
import type { Tables } from '@/types/database'

export default async function MateriaisAdminPage() {
  const supabase = await createClient()
  const [{ data: materiais }, { data: aulas }] = await Promise.all([
    supabase.from('materiais').select('*'),
    supabase.from('aulas').select('*'),
  ])

  const items = (materiais ?? []) as Tables<'materiais'>[]
  const tituloPorAula = new Map(
    ((aulas ?? []) as Tables<'aulas'>[]).map((a) => [a.id, a.titulo])
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Materiais</h1>
        <Button render={<Link href="/admin/materiais/novo">Novo material</Link>} nativeButton={false} />
      </div>
      <DataTable
        items={items}
        editHref={(item) => `/admin/materiais/${item.id}`}
        colunas={[
          { header: 'Arquivo', render: (item) => item.nome_arquivo },
          { header: 'Aula', render: (item) => tituloPorAula.get(item.aula_id) ?? '—' },
          { header: 'Tipo', render: (item) => item.tipo ?? '—' },
        ]}
      />
    </div>
  )
}
