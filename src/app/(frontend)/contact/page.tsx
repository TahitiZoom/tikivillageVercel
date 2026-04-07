'use client'
import { useLocale } from '@/components/LocaleProvider'
import { ContactForm } from '@/components/ContactForm'

export default function ContactPage() {
  const { t } = useLocale()

  return (
    <div style={{ background: 'white', color: '#111', minHeight: '100vh' }}>
      <section style={{ paddingTop: '100px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem',
            letterSpacing: '0.35em', textTransform: 'uppercase', color: '#999', marginBottom: '1rem' }}>
            {t('contact.subtitle')}
          </p>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(2rem,5vw,4.5rem)',
            fontWeight: 300, textTransform: 'uppercase', lineHeight: 0.9,
            letterSpacing: '0.03em', marginBottom: '3rem', whiteSpace: 'pre-line' }}>
            {t('contact.title')}
          </h1>
        </div>
        <div style={{ position: 'relative', width: '100%', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center' }}>
          <img src="/images/contact-hero.webp" alt="Contact"
            style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', filter: 'grayscale(20%)' }} />
          <div style={{ position: 'absolute', bottom: '1rem', right: '1rem',
            writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)',
            fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.6)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            © Ludovic Chan
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.35em',
              textTransform: 'uppercase', color: '#999', marginBottom: '3rem' }}>
              {t('contact.coordinates')}
            </p>
            {[
              { label: 'Email', value: 'contact@tahitizoom.pf', href: 'mailto:contact@tahitizoom.pf' },
              { label: 'Localisation', value: 'Faaa, Tahiti — Polynésie française', href: null },
              { label: 'Facebook', value: 'facebook.com/TahitiZoom', href: 'https://facebook.com/TahitiZoom' },
              { label: 'Instagram', value: '@tahitizoom', href: 'https://instagram.com/tahitizoom' },
            ].map((item) => (
              <div key={item.label} style={{ padding: '1.5rem 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bbb', marginBottom: '0.4rem' }}>
                  {item.label}
                </p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#111', textDecoration: 'none' }}>
                    {item.value}
                  </a>
                ) : (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#111' }}>
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.35em',
              textTransform: 'uppercase', color: '#999', marginBottom: '3rem' }}>
              {t('contact.send_message')}
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
