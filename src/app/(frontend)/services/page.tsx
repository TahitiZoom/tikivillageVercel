'use client'
import Link from 'next/link'
import { useLocale } from '@/components/LocaleProvider'

const servicesData = {
  fr: {
    hero_desc: "Photographe reporter et développeur full stack basé en Polynésie française, je vous accompagne dans vos projets visuels et digitaux.",
    cta_desc: "Discutons de votre projet ensemble. Je vous réponds rapidement.",
    sections: [
      { n: '01', t: 'Photographie', desc: "Avec plus de 30 ans d'expérience en Polynésie française, je capture l'essence du Fenua — ses gens, sa culture, ses paysages.", items: [
        { t: 'Reportage documentaire', d: 'Immersion dans la culture polynésienne, événements sociaux et culturels.' },
        { t: 'Portrait', d: 'Portraits individuels, familiaux et corporate en studio ou en extérieur.' },
        { t: 'Événementiel', d: "Mariages, cérémonies, conférences, soirées d'entreprise." },
        { t: 'Photojournalisme', d: 'Couverture presse, illustrations éditoriales pour médias.' },
        { t: 'Location de studio', d: 'Studio photo équipé disponible à la location à Faaa.' },
        { t: 'Photographie aérienne', d: 'Vues drone pour immobilier, tourisme et publicité.' },
      ]},
      { n: '02', t: 'Développement', desc: "Développeur full stack spécialisé Next.js et Payload CMS, je conçois des applications web performantes et sur mesure.", items: [
        { t: 'Sites web sur mesure', d: 'Next.js, React, TypeScript — interfaces modernes et performantes.' },
        { t: 'CMS Payload', d: 'Administration de contenu sur mesure, collections et globals personnalisés.' },
        { t: 'Applications web', d: 'APIs REST, back-end Node.js, bases de données SQLite / PostgreSQL.' },
        { t: 'Hébergement', d: 'Déploiement sur infrastructure propre Proxmox ou cloud, avec Cloudflare.' },
        { t: 'Maintenance', d: 'Suivi, mises à jour, optimisations et support technique continu.' },
        { t: 'E-commerce', d: 'Boutiques en ligne, systèmes de paiement et gestion des commandes.' },
      ]},
      { n: '03', t: 'Web Design', desc: "L'esthétique au service de l'expérience utilisateur. Interfaces qui allient élégance visuelle et efficacité fonctionnelle.", items: [
        { t: 'UI / UX Design', d: "Conception d'interfaces intuitives et agréables à utiliser." },
        { t: 'Maquettes Figma', d: 'Prototypes interactifs et maquettes haute fidélité.' },
        { t: 'Design system', d: 'Systèmes de composants cohérents et réutilisables.' },
        { t: 'Responsive design', d: 'Interfaces adaptées à tous les écrans, mobile first.' },
        { t: 'Motion design', d: "Animations et transitions pour enrichir l'expérience." },
        { t: 'Refonte visuelle', d: "Modernisation d'interfaces existantes." },
      ]},
      { n: '04', t: 'Infographie', desc: "De l'identité visuelle aux supports print, je crée des visuels qui racontent votre histoire.", items: [
        { t: 'Identité visuelle', d: 'Logo, charte graphique, déclinaisons print et digital.' },
        { t: 'Supports print', d: 'Affiches, flyers, brochures, cartes de visite.' },
        { t: 'Réseaux sociaux', d: 'Visuels et templates pour Facebook, Instagram.' },
        { t: 'Retouche photo', d: 'Post-traitement professionnel Lightroom et Photoshop.' },
        { t: 'Mise en page', d: 'Livres, catalogues, rapports annuels, magazines.' },
        { t: 'Signalétique', d: 'Panneaux, bâches, kakémonos et affichage grand format.' },
      ]},
    ],
  },
  en: {
    hero_desc: "Photojournalist and full stack developer based in French Polynesia, I support you in your visual and digital projects.",
    cta_desc: "Let's discuss your project together. I'll get back to you quickly.",
    sections: [
      { n: '01', t: 'Photography', desc: "With over 30 years of experience in French Polynesia, I capture the essence of the Fenua — its people, culture, and landscapes.", items: [
        { t: 'Documentary reporting', d: 'Immersion in Polynesian culture, social and cultural events.' },
        { t: 'Portrait', d: 'Individual, family and corporate portraits in studio or outdoors.' },
        { t: 'Events', d: 'Weddings, ceremonies, conferences, corporate events.' },
        { t: 'Photojournalism', d: 'Press coverage, editorial illustrations for media.' },
        { t: 'Studio rental', d: 'Fully equipped photo studio available for rental in Faaa.' },
        { t: 'Aerial photography', d: 'Drone views for real estate, tourism and advertising.' },
      ]},
      { n: '02', t: 'Development', desc: "Full stack developer specializing in Next.js and Payload CMS, I design high-performance, custom web applications.", items: [
        { t: 'Custom websites', d: 'Next.js, React, TypeScript — modern and performant interfaces.' },
        { t: 'Payload CMS', d: 'Custom content management, personalized collections and globals.' },
        { t: 'Web applications', d: 'REST APIs, Node.js backend, SQLite / PostgreSQL databases.' },
        { t: 'Hosting', d: 'Deployment on own Proxmox infrastructure or cloud, with Cloudflare.' },
        { t: 'Maintenance', d: 'Monitoring, updates, optimizations and ongoing technical support.' },
        { t: 'E-commerce', d: 'Online stores, payment systems and order management.' },
      ]},
      { n: '03', t: 'Web Design', desc: "Aesthetics at the service of user experience. Interfaces that combine visual elegance and functional efficiency.", items: [
        { t: 'UI / UX Design', d: 'Design of intuitive and pleasant interfaces.' },
        { t: 'Figma mockups', d: 'Interactive prototypes and high-fidelity mockups.' },
        { t: 'Design system', d: 'Consistent and reusable component systems.' },
        { t: 'Responsive design', d: 'Interfaces adapted to all screens, mobile first.' },
        { t: 'Motion design', d: 'Animations and transitions to enrich the experience.' },
        { t: 'Visual redesign', d: 'Modernization of existing interfaces.' },
      ]},
      { n: '04', t: 'Infographics', desc: "From visual identity to print materials, I create visuals that tell your story.", items: [
        { t: 'Visual identity', d: 'Logo, graphic charter, print and digital variations.' },
        { t: 'Print materials', d: 'Posters, flyers, brochures, business cards.' },
        { t: 'Social media', d: 'Visuals and templates for Facebook, Instagram.' },
        { t: 'Photo retouching', d: 'Professional post-processing with Lightroom and Photoshop.' },
        { t: 'Layout', d: 'Books, catalogs, annual reports, magazines.' },
        { t: 'Signage', d: 'Panels, banners, roll-ups and large format printing.' },
      ]},
    ],
  },
}

export default function ServicesPage() {
  const { t, locale } = useLocale()
  const data = servicesData[locale] || servicesData.fr

  return (
    <div style={{ background: 'white', color: '#111', minHeight: '100vh' }}>
      <section style={{ paddingTop: '120px', paddingBottom: '6rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem',
            letterSpacing: '0.35em', textTransform: 'uppercase', color: '#999', marginBottom: '1rem' }}>
            {t('services.subtitle')}
          </p>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(3rem,8vw,7rem)',
            fontWeight: 300, textTransform: 'uppercase', lineHeight: 0.9,
            letterSpacing: '0.03em', marginBottom: '2rem' }}>
            {t('services.title')}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem',
            color: '#777', maxWidth: '600px', lineHeight: '1.7' }}>
            {data.hero_desc}
          </p>
        </div>
      </section>

      {data.sections.map((section, idx) => (
        <section key={section.n} style={{ padding: '6rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.08)',
          background: idx % 2 === 1 ? '#fafafa' : 'white' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                letterSpacing: '0.2em', color: '#ccc', marginBottom: '1rem' }}>/{section.n}</p>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.8rem,3vw,2.8rem)',
                fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111' }}>
                {section.t}
              </h2>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem',
                color: '#555', lineHeight: '1.8', marginBottom: '3rem' }}>
                {section.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                {section.items.map((s) => (
                  <div key={s.t} style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.2rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                      fontWeight: 600, color: '#111', marginBottom: '0.4rem' }}>{s.t}</h4>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                      color: '#888', lineHeight: '1.5' }}>{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.5rem,3vw,2.5rem)',
            fontWeight: 300, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            {t('services.cta')}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: '#777', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            {data.cta_desc}
          </p>
          <Link href="/contact" style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
            letterSpacing: '0.3em', textTransform: 'uppercase', border: '1px solid #111',
            padding: '1rem 3rem', color: '#111', textDecoration: 'none', display: 'inline-block' }}
            className="hover:bg-black hover:text-white transition-all duration-300">
            {t('services.cta_btn')}
          </Link>
        </div>
      </section>
    </div>
  )
}
