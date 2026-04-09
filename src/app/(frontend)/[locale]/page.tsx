import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: `Tiki Village — ${t('tagline')}` }
}

export default function HomePage() {
  const t = useTranslations('home')
  const tNav = useTranslations('nav')

  return (
    <main style={{ paddingTop: '104px' /* header height (topbar 32 + nav 72) */ }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <img
          src="/images/hero-bg.webp"
          alt="Tiki Village Moorea"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,53,55,0.85) 0%, rgba(3,53,55,0.3) 50%, transparent 100%)' }} />

        {/* Frise décorative bas */}
        <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', zIndex: 2 }} />

        <div style={{ position: 'relative', zIndex: 3, padding: '3rem 2rem 5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <p style={{ fontFamily: 'Nohemi, sans-serif', fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FFCE47', marginBottom: '0.75rem' }}>
            LA VISITE INCONTOURNABLE EN POLYNÉSIE
          </p>
          <h1 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: 'clamp(3.5rem, 10vw, 7rem)', fontWeight: 700, color: 'white', lineHeight: 1, margin: '0 0 1.5rem', textTransform: 'uppercase' }}>
            TIKI<br />VILLAGE
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '520px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            {t('subtitle')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="reservations"
              style={{
                display: 'inline-block',
                background: '#FFCE47',
                color: '#033537',
                fontFamily: 'Nohemi, sans-serif',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '0.9rem 2.2rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              RÉSERVER →
            </Link>
            <Link
              href="contact"
              style={{
                display: 'inline-block',
                border: '2px solid white',
                color: 'white',
                fontFamily: 'Nohemi, sans-serif',
                fontWeight: 500,
                fontSize: '0.78rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '0.9rem 2.2rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              NOUS CONTACTER
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────── */}
      <section style={{ background: 'white', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '80px', marginBottom: '1.5rem' }} />
            <h2 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 400, color: '#033537', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.4, marginBottom: '1.5rem' }}>
              Visitez les « Fare » traditionnels et artisanat local, venez vous faire tatouer ou visiter la galerie Gauguin et le Fare Sylvain avec ses photos du Tahiti d'antan.
            </h2>
            <Link
              href="centre-culturel"
              style={{ color: '#10CCAE', fontFamily: 'Nohemi, sans-serif', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600 }}
            >
              EN SAVOIR PLUS →
            </Link>
          </div>
          <div>
            <p style={{ color: '#818181', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Bienvenue au Tiki Village, reconstitution d'un village polynésien d'antan avec son Marae, lieu de culte traditionnel. Vous pourrez y découvrir la culture polynésienne d'aujourd'hui et d'autrefois dans un cadre exceptionnel au cœur de l'île de Moorea.
            </p>
            <p style={{ color: '#818181', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Le restaurant «&nbsp;La Tiki&nbsp;» est de loin le meilleur de la région, il vous sera possible du mardi au samedi de déguster les spécialités tahitiennes. Une visite culturelle pour toute la famille.
            </p>
          </div>
        </div>
      </section>

      {/* ── GALERIE 4 PHOTOS ─────────────────────────── */}
      <section style={{ padding: '0 0 3rem' }}>
        <img src="/images/bg-frise-blanc-horiz-v3-1280.webp" alt="" aria-hidden style={{ width: '100%', display: 'block', marginBottom: '-2px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {['/images/show-1.jpg', '/images/show-2.jpg', '/images/show-3.jpg', '/images/atelier.jpg'].map((src, i) => (
            <div key={i} style={{ aspectRatio: '1', overflow: 'hidden' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }} />
            </div>
          ))}
        </div>
        <img src="/images/bg-frise-blanc-horiz-v3-1280.webp" alt="" aria-hidden style={{ width: '100%', display: 'block', transform: 'scaleY(-1)', marginTop: '-2px' }} />
      </section>

      {/* ── CENTRE CULTUREL ──────────────────────────── */}
      <section style={{ background: '#f9f9f7', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '60px' }} />
            <h2 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#033537', fontWeight: 500 }}>LE CENTRE CULTUREL</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 600, color: '#033537', marginBottom: '1.5rem', lineHeight: 1.3 }}>
                Visitez le fameux centre culturel<br />du Village de Moorea.
              </h3>
              <p style={{ color: '#818181', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                C'est en 1983 que le Tiki Village a vu le jour, sur l'initiative d'Olivier Briac, homme de théâtre reconnu, passionné de culture polynésienne. Après avoir parcouru le monde entier, il décide de créer un lieu unique dédié à la transmission de la culture de ses ancêtres.
              </p>
              <p style={{ color: '#818181', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2rem' }}>
                Aujourd'hui, le Tiki Village de Moorea est reconnu comme l'un des hauts lieux de la culture polynésienne et parmi les incontournables de la Polynésie française.
              </p>
              <Link
                href="centre-culturel"
                style={{ display: 'inline-block', background: '#033537', color: 'white', fontFamily: 'Nohemi, sans-serif', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.85rem 2rem', textDecoration: 'none' }}
              >
                DÉCOUVRIR →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <img src="/images/village.jpg" alt="Centre culturel" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', gridRow: 'span 2' }} />
              <img src="/images/tiki-village-2.jpg" alt="Tiki Village" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
              <img src="/images/show-4.jpg" alt="Show polynésien" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOIRÉE POLYNÉSIENNE ──────────────────────── */}
      <section style={{ background: 'white', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '60px' }} />
            <h2 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#033537', fontWeight: 500 }}>LA SOIRÉE POLYNÉSIENNE</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <img src="/images/soiree.jpg" alt="Soirée polynésienne" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            <div>
              <h3 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 600, color: '#033537', marginBottom: '1.5rem', lineHeight: 1.3 }}>
                Pourquoi est-ce La visite inoubliable ?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { n: '01', title: 'Une Qualité De Services Abordables', text: 'Gentillesse, Partage et Passion font la fierté du Tiki Village.' },
                  { n: '02', title: 'Mariages Traditionnels Sur Commande', text: "Pleine de douceur et d'authenticité, exceptionnel et modernisé polynésiens." },
                  { n: '03', title: 'Une Équipe Adorable Et Compétente', text: "La passion que notre équipe vous transmet vous donnera envie de revenir !" },
                ].map(({ n, title, text }) => (
                  <div key={n} style={{ display: 'flex', gap: '1.5rem' }}>
                    <span style={{ fontFamily: 'Nohemi, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: '#FFCE47', lineHeight: 1, flexShrink: 0 }}>{n}.</span>
                    <div>
                      <h4 style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 600, color: '#033537', marginBottom: '0.4rem' }}>{title}</h4>
                      <p style={{ color: '#818181', fontSize: '0.9rem', lineHeight: 1.6 }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          background: '#033537',
          padding: '4rem 2rem',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <img src="/images/bg-tapa-vertical-gauche-v2-1280.svg" alt="" aria-hidden style={{ position: 'absolute', left: 0, top: 0, height: '100%', opacity: 0.15 }} />
        <img src="/images/bg-tapa-vertical-v2-1280.svg" alt="" aria-hidden style={{ position: 'absolute', right: 0, top: 0, height: '100%', opacity: 0.15 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', fontWeight: 700, color: 'white', textTransform: 'uppercase', lineHeight: 1.2, marginBottom: '2rem' }}>
            Peuple à la légendaire Gentillesse, Visites inoubliables, Moorea comme vous en rêviez&nbsp;!
          </h2>
          <Link
            href="reservations"
            style={{ display: 'inline-block', background: '#FFCE47', color: '#033537', fontFamily: 'Nohemi, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '1rem 2.5rem', textDecoration: 'none' }}
          >
            RÉSERVER →
          </Link>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────── */}
      <section style={{ background: '#f9f9f7', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '60px', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#033537', fontWeight: 500, marginBottom: '3rem' }}>TÉMOIGNAGES</h2>
          <blockquote style={{ borderLeft: 'none', padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>
              {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#FFCE47', fontSize: '1.2rem' }}>★</span>)}
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontStyle: 'italic', color: '#555', lineHeight: 1.8, marginBottom: '2rem' }}>
              "Quelle fantastique visite&nbsp;! À partir du moment où nous avons débuté la visite, nous avons rencontré des gens attachants et toujours disponibles, vraiment compétents et d'une gentillesse incroyable&nbsp;! Réservez vite&nbsp;!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <img src="/images/testimonial-1.jpg" alt="Stéphane & Victoire" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'Nohemi, sans-serif', fontWeight: 600, color: '#033537', fontSize: '0.9rem' }}>Stéphane & Victoire</p>
                <p style={{ color: '#818181', fontSize: '0.8rem' }}>TripAdvisor — ★★★★★</p>
              </div>
            </div>
          </blockquote>
        </div>
      </section>

      {/* ── NEWSLETTER / LES COULISSES ───────────────── */}
      <section
        style={{
          position: 'relative',
          background: '#033537',
          padding: '4rem 2rem',
          overflow: 'hidden',
        }}
      >
        <img src="/images/bg-frise-tapa-swirl-vertical-v2-1280.svg" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Nohemi, sans-serif', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FFCE47', marginBottom: '0.75rem' }}>
            SOUSCRIVEZ À NOTRE NEWSLETTER
          </p>
          <h2 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'white', textTransform: 'uppercase', marginBottom: '2rem' }}>
            LES COULISSES
          </h2>
          <form
            action="/api/newsletter"
            method="post"
            style={{ display: 'flex', gap: '0', maxWidth: '460px', margin: '0 auto' }}
          >
            <input
              type="email"
              name="email"
              placeholder="Votre adresse e-mail"
              required
              style={{ flex: 1, padding: '0.85rem 1.25rem', border: 'none', outline: 'none', fontSize: '0.9rem', background: 'white', color: '#333' }}
            />
            <button
              type="submit"
              style={{ background: '#FFCE47', color: '#033537', border: 'none', padding: '0.85rem 1.5rem', fontFamily: 'Nohemi, sans-serif', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {"S'INSCRIRE →"}
            </button>
          </form>
        </div>
      </section>

      {/* ── NOUS CONTACTER ───────────────────────────── */}
      <section style={{ position: 'relative', padding: '5rem 2rem', overflow: 'hidden' }}>
        <img src="/images/contact-bg.webp" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <img src="/images/contact-bg.webp" alt="Contact Tiki Village" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
          <div>
            <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '60px', marginBottom: '1.5rem' }} />
            <h2 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: '#033537', marginBottom: '1rem', lineHeight: 1.3 }}>
              N'hésitez pas à nous contacter pour plus d'informations.
            </h2>
            <p style={{ color: '#818181', lineHeight: 1.8, marginBottom: '2rem' }}>
              Notre équipe est disponible du mardi au samedi pour répondre à toutes vos questions sur nos prestations.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <p style={{ color: '#033537', fontWeight: 600 }}>📍 Moorea, Polynésie française</p>
              <p style={{ color: '#033537', fontWeight: 600 }}>📞 +689 40 56 18 97</p>
              <p style={{ color: '#033537', fontWeight: 600 }}>✉️ accueil@tikivillage.pf</p>
            </div>
            <Link
              href="contact"
              style={{ display: 'inline-block', background: '#033537', color: 'white', fontFamily: 'Nohemi, sans-serif', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.9rem 2rem', textDecoration: 'none' }}
            >
              NOUS CONTACTER →
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
