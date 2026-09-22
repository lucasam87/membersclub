import Link from 'next/link'
import { AulaCard } from '@/components/catalogo/AulaCard'
import type { Tables } from '@/types/database'

export function CategoriaRow({
  categoria,
  aulas,
  liberacao,
}: {
  categoria: Pick<Tables<'categorias'>, 'id' | 'nome' | 'slug'>
  aulas: Pick<Tables<'aulas'>, 'id' | 'titulo' | 'youtube_url'>[]
  liberacao?: Map<string, boolean>
}) {
  if (aulas.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">{categoria.nome}</h2>
        <Link
          href={`/categoria/${categoria.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Ver tudo
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] snap-x [&::-webkit-scrollbar]:hidden">
        {aulas.map((aula) => (
          <AulaCard key={aula.id} aula={aula} liberada={liberacao?.get(aula.id) ?? true} />
        ))}
      </div>
    </section>
  )
}
