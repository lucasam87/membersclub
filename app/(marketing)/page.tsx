import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { getTrilhasVitrine } from '@/lib/landing/tracks'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { Tracks } from '@/components/landing/Tracks'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { InsideLesson } from '@/components/landing/InsideLesson'
import { Plan } from '@/components/landing/Plan'
import { Faq } from '@/components/landing/Faq'
import { FinalCta } from '@/components/landing/FinalCta'
import { Footer } from '@/components/landing/Footer'

const title = 'Members Club — Educação em TI em formato de série'
const description =
  'Trilhas de TI organizadas em temporadas, com vídeo-aulas, quizzes que liberam a próxima etapa e materiais sempre ao lado. Assine e aprenda no seu ritmo.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    locale: 'pt_BR',
    type: 'website',
  },
}

export default async function LandingPage() {
  const [usuario, trilhas] = await Promise.all([getUser(), getTrilhasVitrine()])

  return (
    <>
      <Header loggedIn={!!usuario} />
      <main>
        <Hero />
        <Tracks trilhas={trilhas} />
        <HowItWorks />
        <InsideLesson />
        <Plan />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
