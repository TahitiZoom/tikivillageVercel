import React from 'react'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { Facebook, Instagram, Youtube } from 'lucide-react'

export async function Footer() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'footer' })

  return (
    <footer style={{ background: '#ffffff', fontFamily: '"Poppins", Sans-serif' }}>
      <style>{`
        .footer-meta-link {
          color: #f0c9cb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-meta-link:hover {
          color: #ffffff;
        }
      `}</style>
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '2.5rem 2rem 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'flex-start', color: '#073f43' }}>
          <a href="https://www.facebook.com/tikivillage" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: '#073f43' }}>
            <Facebook size={20} strokeWidth={2.2} />
          </a>
          <a href="https://www.youtube.com/tikivillage" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ color: '#073f43' }}>
            <Youtube size={20} strokeWidth={2.2} />
          </a>
          <a href="https://www.instagram.com/tikivillage" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#073f43' }}>
            <Instagram size={20} strokeWidth={2.2} />
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem' }}>
          <img
            src="/images/ressources/paiement-securise-par-stripe.png"
            alt="Paiement sécurisé par Stripe"
            style={{ height: '54px', width: 'auto', objectFit: 'contain' }}
          />
          <img
            src="/images/ressources/5d9758ba6ee35payzen-secure-2017-card-350x125-1.webp"
            alt="Paiement sécurisé par PayZen"
            style={{ height: '64px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        <div />
      </div>

      <div
        style={{
          background: '#8e2b31',
          color: '#ffffff',
          padding: '1rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1820px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '1.5rem',
            fontSize: '13px',
            lineHeight: 1.4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span>Copyright © 2026 Tiki Village All rights reserved. Proudly designed by Tahiti Zoom.</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.9rem',
              flexWrap: 'wrap',
              fontFamily: '"Roboto Condensed", sans-serif',
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: 1.2,
              textTransform: 'none',
            }}
          >
            <Link href={`/${locale}/mentions-legales`} className="footer-meta-link">
              CGV
            </Link>
            <Link href={`/${locale}/confidentialite`} className="footer-meta-link">
              Politique de Confidentialité
            </Link>
            <Link href={`/${locale}/mentions-legales`} className="footer-meta-link">
              {t('legalNotice')}
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
            <span>+689 40 550 250</span>
            <span>accueil@tikivillage.pf</span>
            <span>PK 31 côté mer, Haapiti, Moorea</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
