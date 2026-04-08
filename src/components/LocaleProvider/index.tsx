'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import fr from '../../../messages/fr.json'
import en from '../../../messages/en.json'
import ja from '../../../messages/ja.json'

type Locale = 'fr' | 'en' | 'ja'
type Messages = typeof fr

const messages: Record<Locale, Messages> = { fr, en, ja }

interface LocaleContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'fr',
  setLocale: () => {},
  t: (key) => key,
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('tv-locale') as Locale | null
    if (saved === 'fr' || saved === 'en' || saved === 'ja') {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('tv-locale', l)
  }

  const t = (key: string): string => {
    if (!mounted) return key
    const keys = key.split('.')
    let val: any = messages[locale]
    for (const k of keys) {
      val = val?.[k]
    }
    return val || key
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
  )
}

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
