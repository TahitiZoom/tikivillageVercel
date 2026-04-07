import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans, Manrope } from 'next/font/google'
import React from 'react'
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { LocaleProvider } from '@/components/LocaleProvider'
import { CookieBanner } from '@/components/CookieBanner'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const display = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-manrope',
  display: 'swap',
})

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={`${display.variable} ${body.variable} ${manrope.variable}`} lang="fr" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
      </head>
      <body>
        <Providers>
          <LocaleProvider>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <Header />
          {children}
          <Footer />
          <CookieBanner />
            <CookieBanner />
          </LocaleProvider>
          </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL(getServerSideURL()),
  title: {
    template: '%s | Tahiti Zoom',
    default: 'Tahiti Zoom — Stéphane Sayeb Photographe & Développeur Full Stack',
  },
  description: 'Reporter photographe et développeur full stack basé en Polynésie française.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@tahitizoom',
  },
}
