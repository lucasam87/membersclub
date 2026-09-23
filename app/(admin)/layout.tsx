import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/session'
import { logout } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const NAV_ITEMS = [
  { href: '/admin/categorias', label: 'Categorias' },
  { href: '/admin/aulas', label: 'Aulas' },
  { href: '/admin/quizzes', label: 'Quizzes' },
  { href: '/admin/materiais', label: 'Materiais' },
  { href: '/admin/banner', label: 'Banner' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getUser()

  // Camada 2 de protecao (a 1a e' o proxy.ts, a 3a e' RLS via is_admin()).
  if (!usuario) redirect('/login')
  if (usuario.papel !== 'admin') redirect('/inicio')

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border p-4 lg:w-56 lg:border-b-0 lg:border-r">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/inicio" className="text-sm font-semibold tracking-tight">
            Members Club
          </Link>
          <ThemeToggle />
        </div>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-3 py-2 text-sm whitespace-nowrap hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-1">
          <Button render={<Link href="/inicio">Voltar ao site</Link>} nativeButton={false} variant="ghost" size="sm" className="justify-start" />
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit" className="w-full justify-start">
              Sair
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  )
}
