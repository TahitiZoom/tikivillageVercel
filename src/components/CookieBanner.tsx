'use client'
import { useState, useEffect } from 'react'
import { useLocale } from './LocaleProvider'
import Link from 'next/link'

export function CookieBanner() {
  const { locale } = useLocale()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('tz-cookie-consent')
    if (!consent) setTimeout(() => setVisible(true), 1000)
  }, [])

  const accept = () => {
    localStorage.setItem('tz-cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('tz-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
      background: 'white', borderTop: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
      padding: '1.5rem 2rem',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1.5rem' }}>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            color: '#555', lineHeight: '1.6', marginBottom: '0.3rem' }}>
            {locale === 'en'
              ? '🍪 We use cookies to improve your experience on our site.'
              : '🍪 Nous utilisons des cookies pour améliorer votre expérience sur notre site.'}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#999' }}>
            <Link href="/confidentialite"
              style={{ color: '#666', textDecoration: 'underline' }}>
              {locale === 'en' ? 'Privacy policy' : 'Politique de confidentialité'}
            </Link>
            {' · '}
            <Link href="/mentions-legales"
              style={{ color: '#666', textDecoration: 'underline' }}>
              {locale === 'en' ? 'Legal notice' : 'Mentions légales'}
            </Link>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
          <button onClick={decline}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.7rem 1.5rem', border: '1px solid #ccc',
              background: 'transparent', color: '#888', cursor: 'pointer',
              transition: 'all 0.2s' }}>
            {locale === 'en' ? 'Decline' : 'Refuser'}
          </button>
          <button onClick={accept}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.7rem 1.5rem', border: '1px solid #111',
              background: '#111', color: 'white', cursor: 'pointer',
              transition: 'all 0.2s' }}>
            {locale === 'en' ? 'Accept' : 'Accepter'}
          </button>
        </div>
      </div>
    </div>
  )
}
