import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${jetbrainsMono.variable} bg-landing-bg text-landing-text`}>
      {children}
    </div>
  )
}
