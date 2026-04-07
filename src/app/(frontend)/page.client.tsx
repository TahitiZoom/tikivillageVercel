'use client'

import Link from 'next/link'
import { EditorialCarousel } from '@/components/EditorialCarousel'
import { ServicesMenu } from '@/components/ServicesMenu'
import { ClientsCarousel } from '@/components/ClientsCarousel'
import { useLocale } from '@/components/LocaleProvider'

export default function HomePageClient({ posts }: { posts: any[] }) {
  const { t } = useLocale()

  return (
    <div style={{ background: 'white', color: '#111' }}>
      <section style={{ paddingTop: '100px', overflow: 'hidden' }}>
        <div style={{ padding: '2rem 2rem 0', maxWidth: '1400px', margin: '0 auto', textAlign: 'right' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '0.75rem',
            }}
          >
            {t('home.tagline')}
          </p>

          <h1
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(2.5rem,10vw,76px)',
              lineHeight: '1.0',
              fontWeight: 300,
              textTransform: 'uppercase',
              color: '#111',
              marginBottom: '1rem',
            }}
          >
            {t('home.slogan1')}
          </h1>
        </div>

        {posts.length > 0 && (
          <div style={{ margin: '1rem 0' }}>
            <EditorialCarousel posts={posts} />
          </div>
        )}

        <div style={{ padding: '0.75rem 2rem 4rem', maxWidth: '1400px', margin: '0 auto', textAlign: 'right' }}>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(2.5rem,10vw,76px)',
              lineHeight: '1.0',
              fontWeight: 300,
              textTransform: 'uppercase',
              color: '#111',
              marginBottom: '2.5rem',
            }}
          >
            {t('home.slogan2')}
          </h2>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Link
              href="/editorial"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                border: '1px solid #111',
                padding: '0.8rem 2rem',
                color: '#111',
                textDecoration: 'none',
              }}
            >
              {t('home.editorial')}
            </Link>

            <Link
              href="/contact"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#999',
                textDecoration: 'none',
              }}
            >
              {t('home.contact')}
            </Link>
          </div>
        </div>
      </section>

      <section id="services" style={{ padding: '6rem 2rem', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '4rem',
            }}
          >
            {t('home.services')}
          </p>
          <ServicesMenu />
        </div>
      </section>

      <section style={{ padding: '6rem 2rem', background: '#f5f5f5', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(1.5rem,3vw,2.5rem)',
              fontWeight: 300,
              textTransform: 'uppercase',
              lineHeight: 1.1,
              letterSpacing: '0.08em',
              color: '#111',
              marginBottom: '2.5rem',
            }}
          >
            {t('home.devis')}
          </h2>

          <Link
            href="/contact"
            className="devis-cta"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              border: '1px solid #444',
              padding: '1.2rem 4rem',
              color: '#444',
              textDecoration: 'none',
              display: 'inline-block',
              background: 'white',
              transition: 'all 0.3s',
            }}
          >
            {t('home.devis_btn')}
          </Link>
        </div>
      </section>

      <ClientsCarousel />
    </div>
  )
}
