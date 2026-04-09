'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { LocaleSwitcher } from '@/components/LocaleSwitcher'

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'centreCulturel', href: '/centre-culturel' },
  { key: 'showPolynesien', href: '/show-polynesien' },
  { key: 'mariages', href: '/mariages' },
  { key: 'reservations', href: '/reservations' },
  { key: 'contact', href: '/contact' },
]

export const HeaderClient: React.FC = () => {
  const locale = useLocale()
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) => {
    const full = `/${locale}${href === '/' ? '' : href}`
    return pathname === full || pathname.startsWith(`/${locale}${href}/`)
  }

  return (
    <header
      className="w-full z-50 fixed top-0 left-0 right-0"
      style={{ background: '#033537', boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.72rem',
          padding: '0.35rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <span>+689 40 56 18 97 · Moorea, Polynésie française</span>
        <span>
          <a href="mailto:accueil@tikivillage.pf" style={{ color: 'rgba(255,255,255,0.7)' }}>
            accueil@tikivillage.pf
          </a>
        </span>
      </div>

      {/* Main nav */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img
            src="/logo-tiki-white.svg"
            alt="Tiki Village"
            style={{ height: '48px', width: 'auto' }}
          />
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.1rem',
          }}
          className="hidden md:flex"
        >
          {navLinks.map(({ key, href }) => {
            const active = isActive(href)
            return (
              <Link
                key={key}
                href={`/${locale}${href === '/' ? '' : href}`}
                style={{
                  color: active ? '#FFCE47' : 'rgba(255,255,255,0.88)',
                  fontFamily: 'Nohemi, sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.5rem 0.75rem',
                  borderBottom: active ? '2px solid #FFCE47' : '2px solid transparent',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {t(key)}
              </Link>
            )
          })}
          <div style={{ marginLeft: '0.75rem' }}>
            <LocaleSwitcher />
          </div>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: '#022a2c', padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={`/${locale}${href === '/' ? '' : href}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.88)',
                fontFamily: 'Nohemi, sans-serif',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {t(key)}
            </Link>
          ))}
          <div style={{ marginTop: '1rem' }}>
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
