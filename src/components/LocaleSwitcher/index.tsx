'use client'

import React from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const localeLabels: Record<string, string> = {
  fr: 'FR',
  en: 'EN',
  ja: '日',
}

export const LocaleSwitcher: React.FC = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((code) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
            locale === code
              ? 'bg-[#D4504A] text-white'
              : 'text-gray-600 hover:text-[#D4504A] dark:text-gray-300'
          }`}
          aria-label={code === 'fr' ? 'Français' : code === 'en' ? 'English' : '日本語'}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  )
}
