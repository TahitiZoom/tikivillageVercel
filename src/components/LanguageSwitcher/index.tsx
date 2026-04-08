'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const locales = ['fr', 'en', 'ja']
const localeNames: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  ja: '日本語',
}

export function LanguageSwitcher() {
  const pathname = usePathname()

  const getCurrentLocale = () => {
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}`)) {
        return locale
      }
    }
    return 'fr'
  }

  const currentLocale = getCurrentLocale()

  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean)
    if (locales.includes(segments[0])) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }
    return '/' + segments.join('/')
  }

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            currentLocale === locale
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {localeNames[locale]}
        </Link>
      ))}
    </div>
  )
}
