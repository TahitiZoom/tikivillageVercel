'use client'
import Link from 'next/link'
import { useLocale } from '@/components/LocaleProvider'

export default function ConfidentialitePage() {
  const { locale } = useLocale()

  return (
    <div style={{ background: 'white', color: '#111', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 2rem 6rem' }}>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)',
          fontWeight: 300, textTransform: 'uppercase', marginBottom: '1rem' }}>
          {locale === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité'}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#999',
          marginBottom: '3rem' }}>
          {locale === 'en' ? 'Last updated: March 31, 2026' : 'Dernière mise à jour : 31 mars 2026'}
        </p>

        {[
          {
            title: locale === 'en' ? '1. Data Controller' : '1. Responsable du traitement',
            content: locale === 'en'
              ? 'The data controller is Stéphane Sayeb, trading as Tahiti Zoom, N° Tahiti 420737, RCS 151358A, based in Faa\'a, 98704, French Polynesia. Contact: contact@tahitizoom.pf'
              : 'Le responsable du traitement des données est Stéphane Sayeb, exerçant sous l\'enseigne Tahiti Zoom, N° Tahiti 420737, RCS 151358A, domicilié à Faa\'a, 98704, Polynésie Française. Contact : contact@tahitizoom.pf'
          },
          {
            title: locale === 'en' ? '2. Data Collected' : '2. Données collectées',
            content: locale === 'en'
              ? 'When you use the contact form, we collect: your name, email address, subject and message content. This data is used solely to respond to your request and is never sold or shared with third parties.'
              : 'Lors de l\'utilisation du formulaire de contact, nous collectons : votre nom, adresse email, sujet et contenu de votre message. Ces données sont utilisées uniquement pour répondre à votre demande et ne sont jamais vendues ni transmises à des tiers.'
          },
          {
            title: locale === 'en' ? '3. Cookies' : '3. Cookies',
            content: locale === 'en'
              ? 'This site uses strictly necessary cookies to ensure its proper functioning (language preference, session). No advertising or tracking cookies are used without your consent. You can manage your preferences via the cookie banner displayed on your first visit.'
              : 'Ce site utilise des cookies strictement nécessaires à son bon fonctionnement (préférence de langue, session). Aucun cookie publicitaire ou de suivi n\'est utilisé sans votre consentement. Vous pouvez gérer vos préférences via la bannière de cookies affichée lors de votre première visite.'
          },
          {
            title: locale === 'en' ? '4. Data Retention' : '4. Durée de conservation',
            content: locale === 'en'
              ? 'Contact form data is retained for a maximum of 3 years from the date of your request, in accordance with applicable regulations.'
              : 'Les données issues du formulaire de contact sont conservées pendant une durée maximale de 3 ans à compter de la date de votre demande, conformément à la réglementation applicable.'
          },
          {
            title: locale === 'en' ? '5. Your Rights' : '5. Vos droits',
            content: locale === 'en'
              ? 'In accordance with the GDPR, you have the right to access, rectify, delete and port your personal data. To exercise these rights, contact us at: contact@tahitizoom.pf'
              : 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, d\'effacement et de portabilité de vos données personnelles. Pour exercer ces droits, contactez-nous à : contact@tahitizoom.pf'
          },
          {
            title: locale === 'en' ? '6. Security' : '6. Sécurité',
            content: locale === 'en'
              ? 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure or destruction.'
              : 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.'
          },
        ].map((section) => (
          <section key={section.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.1rem',
              fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: '#111', marginBottom: '1rem',
              borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
              {section.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem',
              color: '#555', lineHeight: '1.8' }}>
              {section.content}
            </p>
          </section>
        ))}

        <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem',
          letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999',
          textDecoration: 'none' }}>
          ← {locale === 'en' ? 'Back to home' : 'Retour à l\'accueil'}
        </Link>
      </div>
    </div>
  )
}
