// frontend/app/layout.tsx

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import SupabaseClientWrapper from '@/components/SupabaseClientWrapper'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title:       'Serine AI Agent SaaS',
  description: 'Deploy AI agents for support and sales, multilingual and voice-enabled.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <SupabaseClientWrapper>
            {children}
          </SupabaseClientWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
