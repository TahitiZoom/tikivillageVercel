'use client'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useLocale } from '@/components/LocaleProvider'

const translations: Record<string, Record<string, string>> = {
  'Éditorial': { fr: 'Éditorial', en: 'Editorial' },
  'Editorial': { fr: 'Éditorial', en: 'Editorial' },
  'Services':  { fr: 'Services',  en: 'Services'  },
  'À propos':  { fr: 'À propos',  en: 'About'     },
  'Contact':   { fr: 'Contact',   en: 'Contact'   },
}

const navStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.82rem',
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#111',
  textDecoration: 'none',
}

export const HeaderNav: React.FC<{ data: HeaderType; mobile?: boolean }> = ({ data, mobile }) => {
  const navItems = data?.navItems || []
  const { locale } = useLocale()

  if (mobile) return (
    <nav className="mobile-nav" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {navItems.map(({ link }, i) => {
        const label = link.label || ''
        const translated = translations[label]?.[locale] || label
        return (
          <span key={i} style={{ ...navStyle, fontSize: '1rem' }}>
            <CMSLink {...link} label={translated} appearance="inline" />
          </span>
        )
      })}
      <LocaleSwitcher />
    </nav>
  )

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
      {navItems.map(({ link }, i) => {
        const label = link.label || ''
        const translated = translations[label]?.[locale] || label
        return (
          <span key={i} style={navStyle}>
            <CMSLink {...link} label={translated} appearance="inline" />
          </span>
        )
      })}
      <LocaleSwitcher />
    </nav>
  )
}
