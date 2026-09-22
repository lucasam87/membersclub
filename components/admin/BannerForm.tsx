import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { salvarBanner, excluirBanner } from '@/app/(admin)/admin/banner/actions'
import type { Tables } from '@/types/database'

export function BannerForm({
  banner,
  erro,
}: {
  banner?: Tables<'banner'>
  erro?: string
}) {
  return (
    <div className="max-w-md space-y-4">
      <form action={salvarBanner} className="space-y-4">
        {banner && <input type="hidden" name="id" value={banner.id} />}
        <input type="hidden" name="imagem_url_atual" value={banner?.imagem_url ?? ''} />

        <div className="space-y-2">
          <Label htmlFor="titulo">Titulo</Label>
          <Input id="titulo" name="titulo" defaultValue={banner?.titulo} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="link_destino">Link de destino (opcional)</Label>
          <Input
            id="link_destino"
            name="link_destino"
            type="url"
            defaultValue={banner?.link_destino ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imagem">Imagem {banner && '(deixe em branco para manter a atual)'}</Label>
          {banner?.imagem_url && (
            <div className="relative h-24 w-full overflow-hidden rounded-md bg-muted">
              <Image src={banner.imagem_url} alt="" fill className="object-cover" />
            </div>
          )}
          <Input id="imagem" name="imagem" type="file" accept="image/*" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ordem">Ordem</Label>
          <Input id="ordem" name="ordem" type="number" defaultValue={banner?.ordem ?? 0} required />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="ativo"
            name="ativo"
            type="checkbox"
            defaultChecked={banner?.ativo ?? true}
            className="size-4"
          />
          <Label htmlFor="ativo">Ativo</Label>
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <Button type="submit">Salvar</Button>
      </form>

      {banner && (
        <form action={excluirBanner}>
          <input type="hidden" name="id" value={banner.id} />
          <Button type="submit" variant="destructive">
            Excluir
          </Button>
        </form>
      )}
    </div>
  )
}
