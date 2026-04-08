import { defineRouting } from 'next-intl/routing'
import { getRequestConfig } from 'next-intl/server'

export const routing = defineRouting({
  locales: ['fr', 'en', 'ja'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/posts': {
      fr: '/articles',
      en: '/posts',
      ja: '/記事',
    },
    '/posts/[slug]': {
      fr: '/articles/[slug]',
      en: '/posts/[slug]',
      ja: '/記事/[slug]',
    },
  },
})

export type Pathnames = keyof typeof routing.pathnames
export type Locale = (typeof routing.locales)[number]

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./dictionaries/${locale}`)).default,
}))
