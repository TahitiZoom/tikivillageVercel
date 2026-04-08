'use client'
import React from 'react'
import { useLocale } from '@/components/LocaleProvider'

export const LocaleSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocale()
  const locales: Array<{ code: 'fr' | 'en' | 'ja'; label: string }> = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ]

  return (
    <div className="flex items-center gap-2">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            locale === code
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
