import { Analytics } from "@vercel/analytics/next"
import './globals.css'

export const metadata = {
  title: 'Sessão Estratégica - NextLevel Formed',
  description: 'Agende sua sessão estratégica gratuita e descubra como alcançar seus objetivos. Consultoria personalizada para seu crescimento.',
  keywords: 'sessão estratégica, consultoria, estratégia, nextlevel, planejamento, objetivos, metas, coaching',
  authors: [{ name: 'NextLevel Formed' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Sessão Estratégica – NextLevel Formed',
    description: 'Agende sua sessão estratégica gratuita. Consultoria personalizada para seu crescimento profissional.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'NextLevel Formed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sessão Estratégica – NextLevel Formed',
    description: 'Agende sua sessão estratégica gratuita. Consultoria personalizada.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://api.leadconnectorhq.com" />
        <link rel="preconnect" href="https://link.msgsndr.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preload critical font if needed */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
