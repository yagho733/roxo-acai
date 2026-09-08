import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Mono, DM_Sans } from 'next/font/google'
import './globals.css'
import './premium.css'
import './photo-fixes.css'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'ROXO 53 — Açaí & Bowls',
  description: 'Projeto demonstrativo de açaiteria com cardápio, montagem de açaí e fluxo de pedido.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fff2dd',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${bricolage.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
