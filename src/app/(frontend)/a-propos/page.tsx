'use client'
import Link from 'next/link'
import { useLocale } from '@/components/LocaleProvider'

export default function AProposPage() {
  const { t, locale } = useLocale()

  const skills = {
    fr: [
      { t: 'Photographie', items: ['Reportage documentaire', 'Portrait', 'Événementiel', 'Photojournalisme', 'Post-traitement'] },
      { t: 'Développement', items: ['Next.js / React', 'Node.js / TypeScript', 'Payload CMS', 'SQLite / Turso', 'Proxmox / Cloudflare'] },
      { t: 'Design', items: ['UI/UX Design', 'Identité visuelle', 'Typographie', 'Figma', 'Motion design'] },
    ],
    en: [
      { t: 'Photography', items: ['Documentary reporting', 'Portrait', 'Events', 'Photojournalism', 'Post-processing'] },
      { t: 'Development', items: ['Next.js / React', 'Node.js / TypeScript', 'Payload CMS', 'SQLite / Turso', 'Proxmox / Cloudflare'] },
      { t: 'Design', items: ['UI/UX Design', 'Visual identity', 'Typography', 'Figma', 'Motion design'] },
    ],
  }

  const timeline = {
    fr: [
      { year: '2024 —', title: 'Développeur Full Stack indépendant', desc: 'Conception et développement de sites et applications web sur mesure.' },
      { year: '2015 —', title: 'Photographe reporter indépendant', desc: 'Reportages documentaires en Polynésie française. Collaborations avec médias locaux et internationaux.' },
      { year: '1995 —', title: 'Résident permanent en Polynésie française', desc: "Installé définitivement à Tahiti depuis 1995, après une première découverte du Fenua à la fin des années 70." },
    ],
    en: [
      { year: '2024 —', title: 'Independent Full Stack Developer', desc: 'Design and development of custom websites and web applications.' },
      { year: '2015 —', title: 'Independent Photojournalist', desc: 'Documentary reports in French Polynesia. Collaborations with local and international media.' },
      { year: '1995 —', title: 'Permanent resident in French Polynesia', desc: "Settled permanently in Tahiti since 1995, after first discovering the Fenua in the late 70s." },
    ],
  }

  const equipment = {
    fr: [
      { cat: 'Boîtiers', items: ['Fujifilm X-T3', 'Leica Q3 43'] },
      { cat: 'Optiques', items: ['Fish-eye 8mm', "Gamme complète jusqu'au 400mm"] },
      { cat: 'Éclairage', items: ['Flashs Godox studio', 'Flashs Cobra', 'Softbox', 'Location de studio photo'] },
      { cat: 'Post-production', items: ['Adobe Lightroom Classic', 'Adobe Photoshop'] },
    ],
    en: [
      { cat: 'Bodies', items: ['Fujifilm X-T3', 'Leica Q3 43'] },
      { cat: 'Lenses', items: ['8mm fish-eye', 'Full range up to 400mm'] },
      { cat: 'Lighting', items: ['Godox studio flashes', 'Cobra flashes', 'Softbox', 'Photo studio rental'] },
      { cat: 'Post-production', items: ['Adobe Lightroom Classic', 'Adobe Photoshop'] },
    ],
  }

  return (
    <div style={{ background: 'white', color: '#111', minHeight: '100vh' }}>
      <section style={{ paddingTop: '120px', paddingBottom: '6rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          <div style={{ position: 'relative' }}>
            <img src="/images/portrait-stephane.webp" alt="Stéphane Sayeb"
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '4px', filter: 'grayscale(20%)' }} />
            <div style={{ position: 'absolute', bottom: '-1.5rem', right: '-1.5rem',
              background: 'white', padding: '1rem 1.5rem', border: '1px solid rgba(0,0,0,0.08)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
                {t('about.location')}
              </p>
            </div>
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem',
              writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)',
              fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.6)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              © Kevin Manhein
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              letterSpacing: '0.35em', textTransform: 'uppercase', color: '#999', marginBottom: '1.5rem' }}>
              {t('about.subtitle')}
            </p>
            <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(2.5rem,5vw,4rem)',
              fontWeight: 300, textTransform: 'uppercase', lineHeight: 1.0,
              letterSpacing: '0.03em', marginBottom: '2.5rem' }}>
              Stéphane<br />Sayeb
            </h1>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '1rem',
              lineHeight: '1.8', color: '#555', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <p>{t('about.bio1')}</p>
              <p>{t('about.bio2')}</p>
              <p>{t('about.bio3')}</p>
            </div>
            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
              <Link href="/editorial" style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                letterSpacing: '0.3em', textTransform: 'uppercase', border: '1px solid #111',
                padding: '0.8rem 2rem', color: '#111', textDecoration: 'none' }}>
                {t('about.see_editorial')}
              </Link>
              <Link href="/contact" style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999',
                textDecoration: 'none', alignSelf: 'center' }}>
                {t('about.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section style={{ padding: '6rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.35em',
            textTransform: 'uppercase', color: '#999', marginBottom: '4rem' }}>
            {t('about.skills')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            {(skills[locale] || skills.fr).map((cat) => (
              <div key={cat.t}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.2rem',
                  fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '1.5rem', color: '#111' }}>{cat.t}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {cat.items.map((item) => (
                    <li key={item} style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                      color: '#777', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ width: '20px', height: '1px', background: '#ccc', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcours */}
      <section style={{ padding: '6rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.35em',
            textTransform: 'uppercase', color: '#999', marginBottom: '4rem' }}>
            {t('about.timeline')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(timeline[locale] || timeline.fr).map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr',
                gap: '1.5rem', padding: '2rem 0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  letterSpacing: '0.15em', color: '#bbb', paddingTop: '0.2rem' }}>{item.year}</span>
                <div>
                  <h4 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.1rem',
                    fontWeight: 400, marginBottom: '0.5rem', color: '#111' }}>{item.title}</h4>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    color: '#777', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipements */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.35em',
            textTransform: 'uppercase', color: '#999', marginBottom: '4rem' }}>
            {t('about.equipment')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {(equipment[locale] || equipment.fr).map((cat) => (
              <div key={cat.cat} style={{ padding: '2rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '4px' }}>
                <h4 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem',
                  fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.1em',
                  marginBottom: '1.2rem', color: '#111' }}>{cat.cat}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {cat.items.map((item) => (
                    <li key={item} style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#777' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
