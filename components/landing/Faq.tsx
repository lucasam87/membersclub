import { landingConfig } from '@/lib/landing/config'
import { IconChevronDown } from './icons'

const QUESTIONS = [
  {
    pergunta: 'Preciso seguir as aulas em ordem?',
    resposta:
      'Dentro de cada módulo, sim: a próxima aula libera quando você atinge a nota mínima do quiz. Entre módulos e trilhas, a navegação é livre.',
  },
  {
    pergunta: 'E se eu não passar no quiz?',
    resposta:
      'Você pode refazer. O número de tentativas e a nota mínima são definidos em cada quiz.',
  },
  {
    pergunta: 'O que acontece se o pagamento falhar?',
    resposta:
      'Você tem 2 dias para regularizar antes do acesso ser pausado. Assim que o pagamento é confirmado, tudo volta como estava.',
  },
  {
    pergunta: 'Posso cancelar a qualquer momento?',
    resposta: landingConfig.cancelPolicy,
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 px-5 py-16 lg:px-20 lg:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="font-[var(--font-landing-mono)] text-xs font-medium tracking-[0.08em] text-landing-accent-text uppercase lg:text-[13px]">
            Perguntas
          </p>
          <h2 className="mt-3 font-[var(--font-landing-display)] text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-landing-text lg:text-[52px] lg:leading-[1.05]">
            Antes de entrar.
          </h2>
        </div>

        <div className="divide-y divide-landing-divider">
          {QUESTIONS.map((item, index) => (
            <details key={item.pergunta} className="group py-5" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-landing-text marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent">
                {item.pergunta}
                <IconChevronDown className="size-5 shrink-0 text-landing-text-muted transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[16px] leading-[1.6] text-landing-text-muted">{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
