import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/session'
import { logout } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getUser()
  if (!usuario) redirect('/login')

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/80 px-6 py-4 backdrop-blur-md">
        <Link href="/" className="font-semibold tracking-tight">
          Members Club
        </Link>
        <div className="flex items-center gap-2">
          <Button render={<Link href="/busca">Buscar</Link>} nativeButton={false} variant="ghost" size="sm" />
          <Button render={<Link href="/assinatura">Assinatura</Link>} nativeButton={false} variant="ghost" size="sm" />
          {usuario.papel === 'admin' && (
            <Button
              render={<Link href="/admin/categorias">Admin</Link>}
              nativeButton={false}
              variant="ghost"
              size="sm"
            />
          )}
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">
              Sair
            </Button>
          </form>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
