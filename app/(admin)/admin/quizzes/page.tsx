import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/DataTable'
import type { Tables } from '@/types/database'

export default async function QuizzesAdminPage() {
  const supabase = await createClient()
  const [{ data: quizzes }, { data: aulas }] = await Promise.all([
    supabase.from('quizzes').select('*'),
    supabase.from('aulas').select('*'),
  ])

  const items = (quizzes ?? []) as Tables<'quizzes'>[]
  const tituloPorAula = new Map(
    ((aulas ?? []) as Tables<'aulas'>[]).map((a) => [a.id, a.titulo])
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quizzes</h1>
        <Button render={<Link href="/admin/quizzes/novo">Novo quiz</Link>} nativeButton={false} />
      </div>
      <DataTable
        items={items}
        editHref={(item) => `/admin/quizzes/${item.id}`}
        colunas={[
          { header: 'Aula', render: (item) => tituloPorAula.get(item.aula_id) ?? '—' },
          { header: 'Nota minima', render: (item) => item.nota_minima },
          { header: 'Tentativas', render: (item) => item.max_tentativas },
        ]}
      />
    </div>
  )
}
