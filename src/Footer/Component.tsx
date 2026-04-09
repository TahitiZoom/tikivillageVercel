import React from 'react'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export async function Footer() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'footer' })

  return (
    <footer style={{ background: '#022a2c', color: 'rgba(255,255,255,0.75)', fontFamily: 'Nohemi, sans-serif' }}>

      {/* Frise décorative */}
      <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '100%', display: 'block', opacity: 0.3 }} />

      {/* Main footer */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3.5rem 2rem 2rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem' }}>

        {/* Col 1 — Logo + description */}
        <div>
          <Link href={`/${locale}`}>
            <img src="/logo-tiki-white.svg" alt="Tiki Village" style={{ height: '44px', width: 'auto', marginBottom: '1.25rem', display: 'block' }} />
          </Link>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', maxWidth: '280px' }}>
            Centre culturel polynésien à Moorea, Polynésie française. Reconstitution authentique d'un village d'antan.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['facebook', 'instagram', 'youtube'].map((social) => (
              <a
                key={social}
                href={`https://www.${social}.com/tikivillage`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                {social.charAt(0).toUpperCase() + social.slice(1)}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <h3 style={{ fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#FFCE47', fontWeight: 600, marginBottom: '1.25rem' }}>Navigation</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Accueil', href: '/' },
              { label: 'Le Centre Culturel', href: '/centre-culturel' },
              { label: 'Le Show Polynésien', href: '/show-polynesien' },
              { label: 'Les Mariages', href: '/mariages' },
              { label: 'Réservations', href: '/reservations' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={`/${locale}${href === '/' ? '' : href}`}
                style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3 — Infos */}
        <div>
          <h3 style={{ fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#FFCE47', fontWeight: 600, marginBottom: '1.25rem' }}>Informations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
            <p>📍 Moorea, 98728<br />Polynésie française</p>
            <p>📞 +689 40 56 18 97</p>
            <p>✉️ accueil@tikivillage.pf</p>
            <p>🕐 Mar – Sam : 9h – 22h</p>
          </div>
        </div>

        {/* Col 4 — Légal */}
        <div>
          <h3 style={{ fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#FFCE47', fontWeight: 600, marginBottom: '1.25rem' }}>Légal</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Link href={`/${locale}/mentions-legales`} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', textDecoration: 'none' }}>
              {t('legalNotice')}
            </Link>
            <Link href={`/${locale}/confidentialite`} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', textDecoration: 'none' }}>
              {t('privacy')}
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '1400px', margin: '0 auto', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
        <span>{t('copyright')}</span>
        <span>Site réalisé par <a href="https://tahitizoom.pf" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>TahitiZoom</a></span>
      </div>
    </footer>
  )
}
