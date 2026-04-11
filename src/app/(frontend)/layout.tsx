import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'
import React from 'react'

import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const dosis = localFont({
  src: './fonts/Dosis-VariableFont_wght.ttf',
  variable: '--font-dosis',
  display: 'swap',
  weight: '200 800',
})

// Root layout: minimal shell — lang attribute is set by the [locale] layout below
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(dosis.variable, GeistMono.variable)} lang="fr" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/logo-tiki-color.svg" rel="icon" type="image/svg+xml" />
        <link href="/logo-tiki-color.svg" rel="shortcut icon" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@tikivillage',
  },
}
