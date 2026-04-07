'use client'
import { useEffect, useRef } from 'react'
import { useLocale } from './LocaleProvider'

const clients = [
  { name: 'TNTV', logo: '/images/clients/tntv.webp' },
  { name: 'Radio 1', logo: '/images/clients/radio1.webp' },
  { name: 'Polynésie La 1ère', logo: '/images/clients/la1ere.webp' },
  { name: 'Tiki Village Moorea', logo: '/images/clients/tiki-village.webp' },
  { name: 'Port Autonome Te Ara Tai', logo: '/images/clients/port-autonome.webp' },
  { name: 'CPS', logo: '/images/clients/cps.webp' },
  { name: 'RPI', logo: '/images/clients/rpi.webp' },
  { name: 'Conservatoire Te Fare Upa Rau', logo: '/images/clients/conservatoire.webp' },
  { name: 'Maison de la Culture Te Fare Tahiti Nui', logo: '/images/clients/maison-culture.webp' },
  { name: 'Université de la Polynésie', logo: '/images/clients/upf.webp' },
  { name: 'Mairies', logo: '/images/clients/mairies.webp' },
]

export function ClientsCarousel() {
  const { t } = useLocale()
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef  = useRef<number | null>(null)
  const posRef   = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const step = () => {
      if (!pausedRef.current) {
        posRef.current += 0.4
        const half = track.scrollWidth / 2
        if (posRef.current >= half) posRef.current = 0
        track.style.transform = `translateX(-${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current!)
  }, [])

  const doubled = [...clients, ...clients]

  return (
    <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', marginBottom: '3rem' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem',
          letterSpacing: '0.35em', textTransform: 'uppercase', color: '#999' }}>
          {t('home.clients')}
        </p>
      </div>
      <div style={{ overflow: 'hidden' }}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}>
        <div ref={trackRef} style={{ display: 'flex', alignItems: 'center',
          gap: '4rem', willChange: 'transform', width: 'max-content' }}>
          {doubled.map((client, i) => (
            <div key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', padding: '0.5rem 1rem', minWidth: '140px' }}>
              <img src={client.logo} alt={client.name}
                style={{ height: '60px', width: 'auto', objectFit: 'contain',
                  filter: 'grayscale(100%)', opacity: 0.5, transition: 'opacity 0.3s, filter 0.3s' }}
                onError={(e) => {
                  const parent = (e.target as HTMLImageElement).parentElement
                  if (parent) parent.innerHTML = `<span style="font-family:var(--font-body);font-size:0.75rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#bbb;white-space:nowrap">${client.name}</span>`
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'
                  ;(e.target as HTMLImageElement).style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLImageElement).style.filter = 'grayscale(100%)'
                  ;(e.target as HTMLImageElement).style.opacity = '0.5'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
