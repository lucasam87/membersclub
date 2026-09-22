import { getYoutubeId } from '@/lib/youtube'

export function YoutubeEmbed({ youtubeUrl, titulo }: { youtubeUrl: string; titulo: string }) {
  const id = getYoutubeId(youtubeUrl)

  if (!id) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
        Link do YouTube invalido.
      </div>
    )
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
        title={titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {/* Nota (CLAUDE.md secao 12, pendencia): `rel=0` reduz mas nao elimina
          totalmente sugestoes de videos relacionados ao final do player. */}
    </div>
  )
}
