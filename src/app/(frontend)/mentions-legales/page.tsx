'use client'
import Link from 'next/link'
import { useLocale } from '@/components/LocaleProvider'

export default function MentionsLegalesPage() {
  const { locale } = useLocale()

  return (
    <div style={{ background: 'white', color: '#111', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 2rem 6rem' }}>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)',
          fontWeight: 300, textTransform: 'uppercase', marginBottom: '3rem' }}>
          {locale === 'en' ? 'Legal Notice' : 'Mentions Légales'}
        </h1>

        {[
          {
            title: locale === 'en' ? 'Publisher' : 'Éditeur du site',
            content: [
              'Tahiti Zoom',
              `${locale === 'en' ? 'Sole trader' : 'Patenté'} : Stéphane Sayeb`,
              `N° Tahiti : 420737`,
              `RCS : 151358A`,
              `${locale === 'en' ? 'Address' : 'Adresse'} : Faa'a, 98704, Polynésie Française`,
              `Email : contact@tahitizoom.pf`,
              `${locale === 'en' ? 'Website' : 'Site web'} : https://www.tahitizoom.pf`,
            ]
          },
          {
            title: locale === 'en' ? 'Hosting' : 'Hébergement',
            content: [
              'Tahiti Zoom',
              `Faa'a, 98704, Polynésie Française`,
              `contact@tahitizoom.pf`,
            ]
          },
          {
            title: locale === 'en' ? 'Intellectual Property' : 'Propriété intellectuelle',
            content: [
              locale === 'en'
                ? 'All content on this site (texts, photographs, graphics, logos) is the exclusive property of Tahiti Zoom — Stéphane Sayeb and is protected by French and international intellectual property laws. Any reproduction, even partial, is strictly prohibited without prior written authorization.'
                : 'L\'ensemble des contenus présents sur ce site (textes, photographies, graphismes, logos) est la propriété exclusive de Tahiti Zoom — Stéphane Sayeb et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.',
            ]
          },
          {
            title: locale === 'en' ? 'Liability' : 'Responsabilité',
            content: [
              locale === 'en'
                ? 'Tahiti Zoom makes every effort to ensure that the information available on this site is accurate and up to date. However, Tahiti Zoom cannot be held responsible for omissions, inaccuracies or delays in updating information.'
                : 'Tahiti Zoom met tout en œuvre pour offrir aux visiteurs des informations disponibles et vérifiées. Cependant, Tahiti Zoom ne peut être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour des informations.',
            ]
          },
          {
            title: locale === 'en' ? 'Applicable Law' : 'Droit applicable',
            content: [
              locale === 'en'
                ? 'This site is governed by French law. In the event of a dispute, the courts of Papeete, French Polynesia shall have exclusive jurisdiction.'
                : 'Le présent site est régi par le droit français. En cas de litige, les tribunaux de Papeete, Polynésie française, seront seuls compétents.',
            ]
          },
        ].map((section) => (
          <section key={section.title} style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.1rem',
              fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: '#111', marginBottom: '1rem',
              borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
              {section.title}
            </h2>
            {section.content.map((line, i) => (
              <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                color: '#555', lineHeight: '1.8', marginBottom: '0.4rem' }}>
                {line}
              </p>
            ))}
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
