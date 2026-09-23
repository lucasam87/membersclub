const STEPS = [
  {
    numero: '01',
    titulo: 'Assine e entre no clube',
    texto: 'Uma assinatura libera todo o catálogo. Sem compra de curso avulso, sem letras miúdas.',
  },
  {
    numero: '02',
    titulo: 'Assista e responda o quiz',
    texto: 'Cada aula tem um quiz. Atingiu a nota mínima, a próxima aula da sequência é liberada.',
  },
  {
    numero: '03',
    titulo: 'Acompanhe sua evolução',
    texto:
      'Suas notas de desempenho, anotações pessoais e materiais de apoio ficam guardados em cada aula.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-landing-bg-alt px-5 py-16 lg:px-20 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <p className="font-[var(--font-landing-mono)] text-xs font-medium tracking-[0.08em] text-landing-accent-text uppercase lg:text-[13px]">
          Como funciona
        </p>
        <h2 className="mt-3 max-w-2xl font-[var(--font-landing-display)] text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-landing-text lg:text-[52px] lg:leading-[1.05]">
          Estudo com começo, meio e progresso de verdade.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.numero} className="rounded-2xl border border-landing-border bg-landing-surface p-6">
              <span className="font-[var(--font-landing-mono)] text-sm font-medium text-landing-accent-text">
                {step.numero}
              </span>
              <p className="mt-4 text-[22px] leading-tight font-semibold text-landing-text lg:text-[26px]">
                {step.titulo}
              </p>
              <p className="mt-3 text-[16px] leading-[1.6] text-landing-text-muted">{step.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
