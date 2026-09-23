import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isAlunoRoute = ['/inicio', '/categoria', '/aula', '/busca', '/assinatura'].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
  const isAdminRoute = pathname.startsWith('/admin')

  if (!user && (isAlunoRoute || isAdminRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAdminRoute && user) {
    // Checagem completa de papel (admin) acontece no server component/layout,
    // que tem acesso a `usuarios.papel` via join. Este redirect e' so o
    // primeiro filtro (usuario nao autenticado); RLS via is_admin() e' a
    // camada final que impede escrita mesmo se este proxy tiver um bug.
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)',
  ],
}
