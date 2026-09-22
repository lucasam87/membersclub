import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { CategoriasTree } from '@/components/admin/CategoriasTree'
import type { Tables } from '@/types/database'

export default async function CategoriasAdminPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .order('ordem')

  const items = (categorias ?? []) as Tables<'categorias'>[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categorias</h1>
        <Button render={<Link href="/admin/categorias/novo">Nova categoria</Link>} nativeButton={false} />
      </div>
      <p className="text-sm text-muted-foreground">
        Arraste pelo <span className="whitespace-nowrap">☰</span> para reordenar ou mover uma categoria para dentro/fora de outra.
      </p>
      <CategoriasTree categorias={items} />
    </div>
  )
}
