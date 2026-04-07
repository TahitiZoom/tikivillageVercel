'use client'
import { useLocale } from './LocaleProvider'

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      <button
        onClick={() => setLocale('fr')}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.82rem',
          fontWeight: locale === 'fr' ? 700 : 400,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: locale === 'fr' ? '#111' : '#999',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          transition: 'color 0.2s',
        }}>
        FR
      </button>
      <span style={{ color: '#ccc', fontSize: '0.7rem' }}>|</span>
      <button
        onClick={() => setLocale('en')}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.82rem',
          fontWeight: locale === 'en' ? 700 : 400,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: locale === 'en' ? '#111' : '#999',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          transition: 'color 0.2s',
        }}>
        EN
      </button>
    </div>
  )
}
