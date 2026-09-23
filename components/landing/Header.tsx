'use client'

import { useState } from 'react'
import Link from 'next/link'
import { landingConfig } from '@/lib/landing/config'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { IconMenu, IconX } from './icons'

const NAV_LINKS = [
  { href: '#trilhas', label: 'Trilhas' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#planos', label: 'Plano' },
  { href: '#faq', label: 'Perguntas' },
]

export function Header({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-landing-divider bg-landing-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 lg:px-20">
        <Link href="#top" className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-md bg-landing-accent font-[var(--font-landing-mono)] text-sm font-medium text-landing-accent-ink">
            MC
          </span>
          <span className="font-[var(--font-landing-display)] text-base font-bold tracking-tight text-landing-text">
            Members Club
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-landing-text-muted transition-colors duration-200 hover:text-landing-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {loggedIn ? (
            <Link
              href={landingConfig.memberAreaUrl}
              className="text-sm font-medium text-landing-text transition-colors duration-200 hover:text-landing-accent"
            >
              Ir para minha área
            </Link>
          ) : (
            <Link
              href={landingConfig.loginUrl}
              className="text-sm text-landing-text-muted transition-colors duration-200 hover:text-landing-accent"
            >
              Entrar
            </Link>
          )}
          <a
            href="#planos"
            className="rounded-full bg-landing-accent px-[30px] py-[10px] text-sm font-semibold text-landing-accent-ink transition-[filter] duration-200 hover:brightness-110"
          >
            Quero ser membro
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <a
            href="#planos"
            className="rounded-full bg-landing-accent px-4 py-2 text-sm font-semibold text-landing-accent-ink"
          >
            Quero ser membro
          </a>
          <button
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="landing-mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-md border border-landing-border text-landing-text"
          >
            {open ? <IconX className="size-5" /> : <IconMenu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="landing-mobile-menu"
          className="flex flex-col gap-1 border-t border-landing-divider bg-landing-bg px-5 py-4 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-sm text-landing-text-muted hover:text-landing-accent"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-3 border-t border-landing-divider pt-4">
            {loggedIn ? (
              <Link
                href={landingConfig.memberAreaUrl}
                className="px-2 text-sm font-medium text-landing-text"
              >
                Ir para minha área
              </Link>
            ) : (
              <Link href={landingConfig.loginUrl} className="px-2 text-sm text-landing-text-muted">
                Entrar
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
