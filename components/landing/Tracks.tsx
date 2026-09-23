import type { TrilhaExibicao } from '@/lib/landing/config'
import { IconPlus } from './icons'

export function Tracks({ trilhas }: { trilhas: TrilhaExibicao[] }) {
  return (
    <section id="trilhas" className="scroll-mt-20 px-5 py-16 lg:px-20 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <p className="font-[var(--font-landing-mono)] text-xs font-medium tracking-[0.08em] text-landing-accent uppercase lg:text-[13px]">
          O catálogo
        </p>
        <h2 className="mt-3 max-w-2xl font-[var(--font-landing-display)] text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-landing-text lg:text-[52px] lg:leading-[1.05]">
          Uma trilha para cada momento da sua carreira.
        </h2>
        <p className="mt-4 max-w-xl text-[16px] leading-[1.6] text-landing-text-muted lg:text-[17px]">
          Categorias, subcategorias e aulas em sequência. Escolha por onde começar e avance no seu
          tempo.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trilhas.map((trilha) => (
            <div
              key={trilha.nome}
              className="flex h-[220px] flex-col justify-between rounded-2xl border border-landing-border p-6"
              style={{ backgroundColor: trilha.cor }}
            >
              <span
                className="font-[var(--font-landing-mono)] text-2xl font-medium"
                style={{ color: trilha.glifoCor }}
                aria-hidden="true"
              >
                {trilha.glifo}
              </span>
              <div>
                <p className="text-lg font-semibold text-landing-text">{trilha.nome}</p>
                {trilha.numeroAulas != null && trilha.numeroModulos != null && (
                  <p className="mt-1 font-[var(--font-landing-mono)] text-sm text-landing-text-muted">
                    {trilha.numeroAulas} aulas · {trilha.numeroModulos} módulos
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="flex h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-landing-border-strong p-6 text-center">
            <IconPlus className="size-5 text-landing-text-muted" />
            <p className="text-sm font-medium text-landing-text">Novas trilhas sempre</p>
            <p className="text-sm text-landing-text-muted">O catálogo cresce com a assinatura</p>
          </div>
        </div>
      </div>
    </section>
  )
}
