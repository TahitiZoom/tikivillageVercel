'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import fr from '../../messages/fr.json'
import en from '../../messages/en.json'

type Locale = 'fr' | 'en'
type Messages = typeof fr

const messages = { fr, en }

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

  useEffect(() => {
    const saved = localStorage.getItem('tz-locale') as Locale
    if (saved === 'fr' || saved === 'en') setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('tz-locale', l)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let val: any = messages[locale]
    for (const k of keys) {
      val = val?.[k]
    }
    return val || key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)
