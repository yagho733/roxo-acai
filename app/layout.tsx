import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, DM_Mono, DM_Sans } from 'next/font/google'
import SiteRuntime from './site-runtime'
import './globals.css'
import './premium.css'
import './photo-fixes.css'
import './roxo53.css'
import './final-polish.css'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'ROXO 53 | Açaí & Bowls em Pelotas',
  description: 'Açaí cremoso, frutas frescas, combinações da casa e bowls montados do teu jeito em Pelotas.',
  keywords: ['açaí em Pelotas', 'açaí Pelotas', 'bowls Pelotas', 'delivery de açaí', 'ROXO 53'],
  openGraph: {
    title: 'ROXO 53 | Açaí & Bowls em Pelotas',
    description: 'Açaí cremoso, frutas frescas e combinações feitas do teu jeito.',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <SiteRuntime />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
