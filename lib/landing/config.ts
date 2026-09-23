// Conteudo e configuracao da landing publica (LANDING.md).
// Unico lugar com precos, links de checkout, trilha em destaque, fallback de
// trilhas, politica de cancelamento e links do footer. Nao deve existir
// nenhum outro texto de configuracao "hardcoded" espalhado pelos componentes.

export type TrilhaExibicao = {
  nome: string
  glifo: string
  cor: string
  glifoCor: string
  // Ausentes no fallback estatico (nao ha numero real sem consultar o banco).
  numeroAulas?: number
  numeroModulos?: number
}

export const landingConfig = {
  accent: '#E8B04A',
  accentAlt: ['#7FD1AE', '#8FA8FF', '#F07A5A'],

  // TODO: preencher com o preco real da assinatura antes de publicar.
  price: '[SEU PREÇO]',
  pricePeriod: '/ mês',
  checkoutUrl: '/cadastro',
  loginUrl: '/login',
  memberAreaUrl: '/inicio',

  // TODO: definir qual trilha aparece em destaque no mockup do hero.
  featuredTrack: '[Nome da trilha em destaque]',

  tracks: [
    { nome: 'Programação', glifo: '</>', cor: '#1E2533', glifoCor: '#8FA8D6' },
    { nome: 'Banco de dados', glifo: '{ db }', cor: '#1F2A24', glifoCor: '#8CC4A2' },
    { nome: 'Cloud e DevOps', glifo: '~/cloud', cor: '#1F2B2E', glifoCor: '#86C2C9' },
    { nome: 'Segurança da informação', glifo: '#!sec', cor: '#2B2230', glifoCor: '#C6A0D0' },
    { nome: 'Redes', glifo: 'ip/24', cor: '#2E2620', glifoCor: '#D6B08A' },
  ] satisfies TrilhaExibicao[],

  planBenefits: [
    'Todas as trilhas de TI',
    'Quizzes com nota em cada aula',
    'Materiais para baixar',
    'Anotações pessoais',
    'Novas aulas incluídas',
    'Tema escuro e claro',
  ],

  // TODO: confirmar a politica de cancelamento/reembolso com a plataforma de pagamento escolhida.
  cancelPolicy: '[Confirmar política de cancelamento e reembolso da plataforma de pagamento]',

  // TODO: apontar para as rotas/URLs reais quando existirem.
  footerLinks: {
    termos: '[URL dos termos de uso]',
    privacidade: '[URL da política de privacidade]',
    contato: '[URL ou e-mail de contato]',
  },
} as const

export type LandingConfig = typeof landingConfig
