import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SKALETTE BISTRO | Ristorante & Bar d\'Eccellenza',
  description: 'Un\'esperienza gastronomica unica nel cuore della città. Cucina innovativa, atmosfera raffinata, sapori indimenticabili.',
  keywords: ['ristorante', 'bar', 'cucina italiana', 'fine dining', 'prenotazioni', 'eventi', 'bistro'],
  authors: [{ name: 'SKALETTE BISTRO' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  openGraph: {
    title: 'SKALETTE BISTRO | Ristorante & Bar d\'Eccellenza',
    description: 'Un\'esperienza gastronomica unica nel cuore della città',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={inter.variable}>
      <body className={inter.className}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
