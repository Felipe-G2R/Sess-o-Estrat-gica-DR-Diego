import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Sessão Estratégica - NextLevel Formed',
  description: 'Agende sua sessão estratégica gratuita e descubra como alcançar seus objetivos.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
