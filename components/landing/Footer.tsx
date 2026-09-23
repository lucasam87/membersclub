import { landingConfig } from '@/lib/landing/config'

function resolveHref(value: string) {
  return value.startsWith('[') ? '#' : value
}

export function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="border-t border-landing-divider px-5 py-10 lg:px-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-sm text-landing-text-muted sm:flex-row">
        <p>© {ano} Members Club</p>
        <nav className="flex items-center gap-6">
          <a href={resolveHref(landingConfig.footerLinks.termos)} className="hover:text-landing-accent">
            Termos de uso
          </a>
          <a href={resolveHref(landingConfig.footerLinks.privacidade)} className="hover:text-landing-accent">
            Privacidade
          </a>
          <a href={resolveHref(landingConfig.footerLinks.contato)} className="hover:text-landing-accent">
            Contato
          </a>
        </nav>
      </div>
    </footer>
  )
}
