import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import { AdminBar } from '@/components/AdminBar'
import { CookieBanner } from '@/components/CookieBanner'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { routing } from '@/i18n/routing'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params: paramsPromise }: Props) {
  const { locale } = await paramsPromise
  const { isEnabled } = await draftMode()

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />
        <Header />
        {children}
        <Footer />
        <CookieBanner />
      </Providers>
    </NextIntlClientProvider>
  )
}
