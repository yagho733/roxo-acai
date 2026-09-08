import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Mono, DM_Sans } from 'next/font/google'
import './globals.css'
import './premium.css'
import './photo-fixes.css'
import './roxo53.css'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'ROXO 53 — Açaí & Bowls | Pelotas',
  description: 'Açaí em camadas, combinações da casa e montagem do seu jeito. Uma experiência de pedido simples, visual e rápida.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1b1024',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${bricolage.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
