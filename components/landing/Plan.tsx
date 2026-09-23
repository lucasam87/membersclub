import { landingConfig } from '@/lib/landing/config'
import { IconCheck } from './icons'

export function Plan() {
  return (
    <section id="planos" className="scroll-mt-20 bg-landing-bg-alt px-5 py-16 lg:px-20 lg:py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="font-[var(--font-landing-mono)] text-xs font-medium tracking-[0.08em] text-landing-accent uppercase lg:text-[13px]">
            Assinatura
          </p>
          <h2 className="mt-3 font-[var(--font-landing-display)] text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-landing-text lg:text-[52px] lg:leading-[1.05]">
            Um plano. O catálogo inteiro.
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-[1.6] text-landing-text-muted lg:text-[17px]">
            Sua assinatura renova automaticamente e você pode cancelar quando quiser, direto pela
            plataforma.
          </p>
        </div>

        <div className="rounded-3xl border border-landing-accent bg-landing-surface p-8">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-landing-text">Members Club</p>
            <span className="rounded-full bg-landing-accent/15 px-3 py-1 text-xs font-medium text-landing-accent">
              Acesso completo
            </span>
          </div>

          <p className="mt-6">
            <span className="font-[var(--font-landing-display)] text-[40px] font-bold tracking-[-0.03em] text-landing-text">
              {landingConfig.price}
            </span>
            <span className="ml-1 text-sm text-landing-text-muted">{landingConfig.pricePeriod}</span>
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {landingConfig.planBenefits.map((beneficio) => (
              <li key={beneficio} className="flex items-start gap-2 text-sm text-landing-text">
                <IconCheck className="mt-0.5 size-4 shrink-0 text-landing-accent" />
                {beneficio}
              </li>
            ))}
          </ul>

          <a
            href={landingConfig.checkoutUrl}
            className="mt-8 block w-full rounded-full bg-landing-accent px-[30px] py-[18px] text-center text-sm font-semibold text-landing-accent-ink transition-[filter] duration-200 hover:brightness-110"
          >
            Assinar agora
          </a>
        </div>
      </div>
    </section>
  )
}
