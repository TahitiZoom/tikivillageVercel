import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en', 'ja'],
  defaultLocale: 'fr',
  localePrefix: 'always',
})
