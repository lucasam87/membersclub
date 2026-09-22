import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Tables } from '@/types/database'

export function Banner({ banner }: { banner: Tables<'banner'> }) {
  const conteudo = (
    <div className="relative flex h-[45vh] min-h-72 w-full items-end overflow-hidden">
      <Image
        src={banner.imagem_url}
        alt={banner.titulo}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="relative z-10 space-y-3 px-6 pb-10">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {banner.titulo}
        </h1>
        {banner.link_destino && (
          <Button render={<Link href={banner.link_destino}>Assistir agora</Link>} nativeButton={false} />
        )}
      </div>
    </div>
  )

  return conteudo
}
