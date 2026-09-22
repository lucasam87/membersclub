import Image from 'next/image'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { getYoutubeThumbnail } from '@/lib/youtube'
import type { Tables } from '@/types/database'

export function AulaCard({
  aula,
  liberada = true,
}: {
  aula: Pick<Tables<'aulas'>, 'id' | 'titulo' | 'youtube_url'>
  liberada?: boolean
}) {
  const thumb = getYoutubeThumbnail(aula.youtube_url)

  const conteudo = (
    <div className="w-44 shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-black/10 sm:w-56">
      <div className="relative aspect-video w-full bg-muted">
        {thumb && (
          <Image
            src={thumb}
            alt={aula.titulo}
            fill
            sizes="224px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {!liberada && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Lock className="size-6 text-foreground" role="img" aria-label="Aula bloqueada" />
          </div>
        )}
      </div>
      <p className="truncate px-2 py-2 text-sm font-medium">{aula.titulo}</p>
    </div>
  )

  if (!liberada) {
    return (
      <div className="group" aria-disabled>
        {conteudo}
      </div>
    )
  }

  return (
    <Link
      href={`/aula/${aula.id}`}
      className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {conteudo}
    </Link>
  )
}
