'use client'

import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import React, { useEffect, useState } from 'react'

const CONSENT_KEY = 'tv-cookie-consent'

export const CookieBanner: React.FC = () => {
  const locale = useLocale()
  const t = useTranslations('cookie')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!visible) return null

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'white',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        padding: '1.5rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#555',
              lineHeight: '1.6',
              marginBottom: '0.3rem',
            }}
          >
            🍪 {t('message')}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#999' }}>
            <Link
              href="/confidentialite"
              locale={locale as 'fr' | 'en' | 'ja'}
              style={{ color: '#666', textDecoration: 'underline' }}
            >
              {t('privacy')}
            </Link>
            {' · '}
            <Link
              href="/mentions-legales"
              locale={locale as 'fr' | 'en' | 'ja'}
              style={{ color: '#666', textDecoration: 'underline' }}
            >
              {t('legal')}
            </Link>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
          <button
            onClick={decline}
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '0.7rem 1.5rem',
              border: '1px solid #ccc',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t('decline')}
          </button>
          <button
            onClick={accept}
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '0.7rem 1.5rem',
              border: '1px solid #D4504A',
              background: '#D4504A',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
