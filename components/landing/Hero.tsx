import Image from 'next/image'
import { landingConfig } from '@/lib/landing/config'
import { IconCheck, IconLock, IconPlay } from './icons'

const CONTINUE_CARDS = [1, 2, 3, 4]
const DEV_CARDS = [1, 2, 3, 4]

export function Hero() {
  return (
    <section id="top" className="scroll-mt-20 px-5 pt-16 pb-16 lg:px-20 lg:pt-24 lg:pb-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[560px_1fr] lg:gap-16">
        <div>
          <p className="font-[var(--font-landing-mono)] text-xs font-medium tracking-[0.08em] text-landing-accent-text uppercase lg:text-[13px]">
            Clube de membros · Educação em TI
          </p>
          <h1 className="mt-4 font-[var(--font-landing-display)] text-[40px] leading-[1.05] font-bold tracking-[-0.03em] text-landing-text lg:text-[72px] lg:leading-[1.02]">
            Aprenda tecnologia como quem maratona uma série.
          </h1>
          <p className="mt-6 text-[17px] leading-[1.55] text-landing-text-muted lg:text-[19px]">
            Trilhas de TI organizadas em temporadas, com vídeo-aulas, quizzes que liberam a próxima
            etapa e seus materiais sempre ao lado. Um catálogo pensado para quem leva a carreira a
            sério.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#planos"
              className="rounded-full bg-landing-accent px-[30px] py-[18px] text-center text-sm font-semibold text-landing-accent-ink transition-[filter] duration-200 hover:brightness-110"
            >
              Quero ser membro
            </a>
            <a
              href="#trilhas"
              className="flex items-center justify-center gap-2 rounded-full border border-landing-border-strong px-[30px] py-[18px] text-center text-sm font-semibold text-landing-text transition-colors duration-200 hover:border-landing-accent hover:text-landing-accent"
            >
              <IconPlay className="size-4" />
              Ver as trilhas
            </a>
          </div>

          <p className="mt-6 font-[var(--font-landing-mono)] text-[13px] text-landing-text-muted">
            Cancele quando quiser · Tema escuro e claro · Assista no seu ritmo
          </p>
        </div>

        {landingConfig.heroImageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-landing-border shadow-[0_40px_120px_rgba(0,0,0,.55)]">
            <Image
              src={landingConfig.heroImageUrl}
              alt="Home da área de membros, com a trilha em destaque e as aulas em andamento"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
        <div
          className="rounded-[20px] border border-landing-border bg-landing-surface p-4 shadow-[0_40px_120px_rgba(0,0,0,.55)] lg:p-5"
          aria-hidden="true"
        >
          <div className="mb-4 flex gap-1.5">
            <span className="size-2.5 rounded-full bg-landing-border-strong" />
            <span className="size-2.5 rounded-full bg-landing-border-strong" />
            <span className="size-2.5 rounded-full bg-landing-border-strong" />
          </div>

          <div className="rounded-2xl bg-landing-surface-2 p-5">
            <p className="font-[var(--font-landing-mono)] text-[11px] font-medium tracking-[0.08em] text-landing-accent-text uppercase">
              Em destaque
            </p>
            <p className="mt-1 text-lg font-semibold text-landing-text">{landingConfig.featuredTrack}</p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-landing-accent px-4 py-1.5 text-xs font-semibold text-landing-accent-ink">
                Continuar
              </span>
              <span className="rounded-full border border-landing-border-strong px-4 py-1.5 text-xs font-semibold text-landing-text">
                Detalhes
              </span>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-landing-text">Continue de onde parou</p>
            <div className="grid grid-cols-4 gap-2">
              {CONTINUE_CARDS.map((n) => (
                <div key={n} className="rounded-lg border border-landing-border bg-landing-surface-3 p-2">
                  <div className="flex aspect-video items-center justify-center rounded-md bg-landing-surface-2">
                    <IconPlay className="size-4 text-landing-text-muted" />
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-landing-border">
                    <div className="h-1 rounded-full bg-landing-accent" style={{ width: `${n * 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-landing-text">Desenvolvimento</p>
            <div className="grid grid-cols-4 gap-2">
              {DEV_CARDS.map((n) => (
                <div key={n} className="rounded-lg border border-landing-border bg-landing-surface-3 p-2">
                  <div className="flex aspect-video items-center justify-center rounded-md bg-landing-surface-2">
                    {n === 1 ? (
                      <IconCheck className="size-4 text-landing-success" />
                    ) : n >= 3 ? (
                      <IconLock className="size-4 text-landing-text-disabled" />
                    ) : (
                      <IconPlay className="size-4 text-landing-text-muted" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
