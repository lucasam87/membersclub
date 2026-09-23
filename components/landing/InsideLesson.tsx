import Image from 'next/image'
import { landingConfig } from '@/lib/landing/config'
import { IconCheck, IconLock, IconPlay } from './icons'

export function InsideLesson() {
  return (
    <section className="px-5 py-16 lg:px-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] text-center">
        <p className="font-[var(--font-landing-mono)] text-xs font-medium tracking-[0.08em] text-landing-accent-text uppercase lg:text-[13px]">
          Por dentro da aula
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-[var(--font-landing-display)] text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-landing-text lg:text-[52px] lg:leading-[1.05]">
          Tudo o que você precisa, numa tela só.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.6] text-landing-text-muted lg:text-[17px]">
          Navegação da trilha à esquerda, vídeo no centro, quiz, anotações e materiais à direita.
        </p>

        {/* Mockup de desktop */}
        {landingConfig.insideLessonImageUrl ? (
          <div className="relative mx-auto mt-10 hidden aspect-[1280/560] max-w-[1280px] overflow-hidden rounded-[20px] border border-landing-border lg:block">
            <Image
              src={landingConfig.insideLessonImageUrl}
              alt="Tela da aula, com a navegação da trilha, o vídeo e o quiz"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
        <div
          className="mx-auto mt-10 hidden max-w-[1280px] gap-4 rounded-[20px] border border-landing-border bg-landing-surface p-5 text-left lg:grid lg:h-[560px] lg:grid-cols-[240px_1fr_280px]"
          aria-hidden="true"
        >
          <div className="rounded-xl bg-landing-surface-2 p-4">
            <p className="font-[var(--font-landing-mono)] text-[11px] tracking-[0.08em] text-landing-text-muted uppercase">
              Programação › Fundamentos
            </p>
            <div className="mt-4 flex flex-col gap-1">
              {[
                { n: 1, estado: 'concluida' },
                { n: 2, estado: 'concluida' },
                { n: 3, estado: 'ativa' },
                { n: 4, estado: 'bloqueada' },
                { n: 5, estado: 'bloqueada' },
              ].map((aula) => (
                <div
                  key={aula.n}
                  className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${
                    aula.estado === 'ativa'
                      ? 'bg-landing-surface-3 text-landing-text'
                      : 'text-landing-text-muted'
                  }`}
                >
                  {aula.estado === 'concluida' && <IconCheck className="size-4 shrink-0 text-landing-success" />}
                  {aula.estado === 'ativa' && <IconPlay className="size-4 shrink-0 text-landing-accent" />}
                  {aula.estado === 'bloqueada' && (
                    <IconLock className="size-4 shrink-0 text-landing-text-disabled" />
                  )}
                  Aula {aula.n}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-landing-surface-2 p-4">
            <span className="flex size-16 items-center justify-center rounded-full bg-landing-accent text-landing-accent-ink">
              <IconPlay className="size-6" />
            </span>
            <p className="mt-4 text-sm font-medium text-landing-text">Aula 3 · Título da aula</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-landing-surface-2 p-4">
              <p className="text-sm font-semibold text-landing-text">Quiz da aula</p>
              <p className="font-[var(--font-landing-mono)] text-xs text-landing-text-muted">mín. 70%</p>
              <div className="mt-3 flex flex-col gap-2">
                {['A', 'B', 'C'].map((letra) => (
                  <div
                    key={letra}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      letra === 'B'
                        ? 'border-landing-accent text-landing-text'
                        : 'border-landing-border text-landing-text-muted'
                    }`}
                  >
                    {letra}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-landing-surface-2 p-4">
              <p className="text-sm font-semibold text-landing-text">Minhas anotações</p>
            </div>
            <div className="rounded-xl bg-landing-surface-2 p-4">
              <p className="text-sm font-semibold text-landing-text">Materiais</p>
              <p className="text-xs text-landing-text-muted">slides.pdf</p>
            </div>
          </div>
        </div>
        )}

        {/* Empilhado no mobile/tablet */}
        {landingConfig.insideLessonMobileImageUrl ? (
          <div className="relative mx-auto mt-10 aspect-[390/700] max-w-xl overflow-hidden rounded-[20px] border border-landing-border lg:hidden">
            <Image
              src={landingConfig.insideLessonMobileImageUrl}
              alt="Tela da aula no celular, com o vídeo, o quiz e os materiais"
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
        <div className="mx-auto mt-10 flex max-w-xl flex-col gap-4 rounded-[20px] border border-landing-border bg-landing-surface p-4 text-left lg:hidden">
          <div className="flex flex-col items-center justify-center rounded-xl bg-landing-surface-2 p-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-landing-accent text-landing-accent-ink">
              <IconPlay className="size-5" />
            </span>
            <p className="mt-3 text-sm font-medium text-landing-text">Aula 3 · Título da aula</p>
          </div>
          <div className="rounded-xl bg-landing-surface-2 p-4">
            <p className="text-sm font-semibold text-landing-text">Quiz da aula</p>
            <p className="font-[var(--font-landing-mono)] text-xs text-landing-text-muted">mín. 70%</p>
          </div>
          <div className="rounded-xl bg-landing-surface-2 p-4">
            <p className="text-sm font-semibold text-landing-text">Minhas anotações</p>
          </div>
          <div className="rounded-xl bg-landing-surface-2 p-4">
            <p className="text-sm font-semibold text-landing-text">Materiais</p>
            <p className="text-xs text-landing-text-muted">slides.pdf</p>
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
