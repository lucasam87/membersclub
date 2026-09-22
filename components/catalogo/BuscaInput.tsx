'use client'

import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function BuscaInput({ valorInicial = '' }: { valorInicial?: string }) {
  const router = useRouter()

  return (
    <form
      action="/busca"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault()
        const q = new FormData(e.currentTarget).get('q')
        router.push(`/busca?q=${encodeURIComponent(String(q ?? ''))}`)
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Buscar aulas..."
        defaultValue={valorInicial}
        className="pl-9"
      />
    </form>
  )
}
