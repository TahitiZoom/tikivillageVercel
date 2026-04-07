'use client'
import Link from 'next/link'
import { useLocale } from './LocaleProvider'
import { CMSLink } from './Link'

const navTranslations: Record<string, Record<string, string>> = {
  'Éditorial': { fr: 'Éditorial', en: 'Editorial' },
  'Editorial': { fr: 'Éditorial', en: 'Editorial' },
  'Services':  { fr: 'Services',  en: 'Services'  },
  'À propos':  { fr: 'À propos',  en: 'About'     },
  'Contact':   { fr: 'Contact',   en: 'Contact'   },
  'Admin':     { fr: 'Admin',     en: 'Admin'      },
}

export function FooterClient({ navItems }: { navItems: any[] }) {
  const { locale } = useLocale()

  const t = {
    tagline: {
      fr: 'Reporter photographe & développeur full stack en Polynésie française.',
      en: 'Photojournalist & full stack developer in French Polynesia.',
    },
    navigation: { fr: 'Navigation', en: 'Navigation' },
    contact: { fr: 'Contact', en: 'Contact' },
    location: { fr: 'Faa\'a, Tahiti — Polynésie française', en: 'Faa\'a, Tahiti — French Polynesia' },
    copyright: {
      fr: `© ${new Date().getFullYear()} Tahiti Zoom — Made with love by Stéphane Sayeb`,
      en: `© ${new Date().getFullYear()} Tahiti Zoom — Made with love by Stéphane Sayeb`,
    },
    legal: { fr: 'Mentions légales', en: 'Legal Notice' },
    privacy: { fr: 'Confidentialité', en: 'Privacy' },
  }

  return (
    <footer style={{ background: 'white', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem', marginBottom: '3rem' }}>

          {/* Logo + description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/">
              <img src="/Logo-Tahiti-Zoom-144x144.png" alt="Tahiti Zoom"
                style={{ height: '50px', width: 'auto' }} />
            </Link>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem',
              color: '#888', lineHeight: '1.6', maxWidth: '220px' }}>
              {t.tagline[locale]}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              {[
                { href: 'https://facebook.com/TahitiZoom', label: 'Facebook', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                )},
                { href: 'https://instagram.com/tahitizoom', label: 'Instagram', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                )},
                { href: 'https://linkedin.com/in/tahitizoom', label: 'LinkedIn', icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                )},
              ].map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{ color: '#999', transition: 'color 0.2s' }}
                  className="hover:text-black">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bbb',
              marginBottom: '1.2rem' }}>{t.navigation[locale]}</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {navItems.map(({ link }, i) => {
                const label = link.label || ''
                const translated = navTranslations[label]?.[locale] || label
                return (
                  <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#666' }}>
                    <CMSLink {...link} label={translated} />
                  </span>
                )
              })}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bbb',
              marginBottom: '1.2rem' }}>{t.contact[locale]}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <a href="mailto:contact@tahitizoom.pf"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: '#666', textDecoration: 'none' }}
                className="hover:text-black transition-colors">
                contact@tahitizoom.pf
              </a>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#888' }}>
                {t.location[locale]}
              </p>
            </div>
          </div>

        </div>

        {/* Bas de page */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bbb' }}>
            {t.copyright[locale]}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/mentions-legales"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#bbb', textDecoration: 'none' }}
              className="hover:text-black transition-colors">
              {t.legal[locale]}
            </Link>
            <Link href="/confidentialite"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#bbb', textDecoration: 'none' }}
              className="hover:text-black transition-colors">
              {t.privacy[locale]}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
