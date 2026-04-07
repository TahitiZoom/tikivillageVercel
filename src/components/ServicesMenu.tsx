'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from './LocaleProvider'

const servicesData = {
  fr: [
    { n: '01', t: 'Photographie',  d: 'Reportages documentaires, portraits, événements culturels en Polynésie française.', img: '/images/service-photo.webp' },
    { n: '02', t: 'Développement', d: 'Applications web Next.js, APIs REST, CMS Payload sur mesure et hébergement.',      img: '/images/service-dev.webp' },
    { n: '03', t: 'Web Design',    d: 'Interfaces élégantes, expériences utilisateur mémorables et identités digitales.',  img: '/images/service-design.webp' },
    { n: '04', t: 'Infographie',   d: 'Identité visuelle complète, logos, affiches, supports print et communication.',     img: '/images/service-infographie.webp' },
  ],
  en: [
    { n: '01', t: 'Photography',   d: 'Documentary reports, portraits, cultural events in French Polynesia.',             img: '/images/service-photo.webp' },
    { n: '02', t: 'Development',   d: 'Next.js web apps, REST APIs, custom Payload CMS and hosting.',                     img: '/images/service-dev.webp' },
    { n: '03', t: 'Web Design',    d: 'Elegant interfaces, memorable user experiences and digital identities.',           img: '/images/service-design.webp' },
    { n: '04', t: 'Infographics',  d: 'Complete visual identity, logos, posters, print and communication materials.',     img: '/images/service-infographie.webp' },
  ],
}

export function ServicesMenu() {
  const { locale } = useLocale()
  const services = servicesData[locale] || servicesData.fr
  const [active, setActive] = useState<number | null>(null)
  const [pos, setPos]       = useState({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent) => setPos({ x: e.clientX, y: e.clientY })

  return (
    <div onMouseMove={handleMove} style={{ position: 'relative' }}>
      {services.map((s, i) => (
        <Link key={s.n} href="/services"
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.2rem 0.5rem',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            textDecoration: 'none',
            background: active === i ? 'rgba(0,0,0,0.06)' : 'transparent',
            transition: 'background 0.3s',
            position: 'relative',
          }}>

          <img src={s.img} alt={s.t}
            style={{
              position: 'fixed',
              left: pos.x - 100,
              top: pos.y - 120,
              width: '200px',
              height: '240px',
              objectFit: 'cover',
              pointerEvents: 'none',
              zIndex: 100,
              borderRadius: '4px',
              transform: active === i ? 'rotateX(360deg)' : 'rotateX(270deg)',
              opacity: active === i ? 1 : 0,
              transition: '0.15s',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem',
              color: active === i ? '#111' : '#ccc', letterSpacing: '0.2em',
              transition: 'color 0.3s' }}>/{s.n}</span>
            <span style={{ fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(1.4rem,2.8vw,2.4rem)', fontWeight: 300,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              color: active === i ? '#111' : '#aaa', transition: 'color 0.4s' }}>
              {s.t}
            </span>
          </div>

          <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem',
            color: active === i ? '#555' : '#bbb', maxWidth: '320px',
            textAlign: 'right', lineHeight: '1.6', transition: 'color 0.3s' }}
            className="hidden md:block">{s.d}</span>

        </Link>
      ))}
    </div>
  )
}
