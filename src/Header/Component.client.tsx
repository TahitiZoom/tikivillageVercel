'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import React, { useState } from 'react'
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Youtube,
} from 'lucide-react'

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

  const localeLabel =
    locale === 'fr' ? 'Français' : locale === 'en' ? 'English' : '日本語'

  const isActive = (href: string) => {
    const full = `/${locale}${href === '/' ? '' : href}`
    return pathname === full || pathname.startsWith(`/${locale}${href}/`)
  }

  return (
    <>
      <header
        className="w-full z-50 fixed top-0 left-0 right-0"
        style={{
          background: '#ffffff',
          boxShadow: '0 2px 12px rgba(10, 40, 80, 0.08)',
        }}
      >
        <div
          style={{
            background: '#c8dcee',
            color: '#314266',
            minHeight: '62px',
          }}
        >
          <div
            style={{
              maxWidth: '1680px',
              margin: '0 auto',
              padding: '0 2.5rem',
              minHeight: '62px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              fontFamily: 'Nohemi, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            <div className="hidden lg:flex" style={{ flex: 1, justifyContent: 'flex-start' }}>
              <a
                href="https://maps.google.com/?q=PK%2031%20C%C3%B4t%C3%A9%20Mer%2C%20Haapiti%2C%20Moorea"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  color: '#314266',
                  textDecoration: 'none',
                }}
              >
                <MapPin size={14} strokeWidth={2} color="#213056" />
                <span>PK 31 Côté Mer, Haapiti, Moorea</span>
              </a>
            </div>

            <div className="hidden md:flex" style={{ flex: 1, justifyContent: 'center' }}>
              <a
                href="mailto:accueil@tikivillage.pf"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  color: '#314266',
                  textDecoration: 'none',
                }}
              >
                <Mail size={14} strokeWidth={2} color="#213056" />
                <span>accueil@tikivillage.pf</span>
              </a>
            </div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '1.5rem',
              }}
            >
              <a
                href="tel:+68940550250"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: '#314266',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <Phone size={14} strokeWidth={2.2} color="#213056" />
                <span>+689 40 550 250</span>
              </a>

              <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '1.15rem' }}>
                <a href="#" aria-label="Facebook" style={{ color: '#073f43' }}>
                  <Facebook size={17} strokeWidth={2.2} />
                </a>
                <a href="#" aria-label="Instagram" style={{ color: '#073f43' }}>
                  <Instagram size={17} strokeWidth={2.2} />
                </a>
                <a href="#" aria-label="YouTube" style={{ color: '#073f43' }}>
                  <Youtube size={17} strokeWidth={2.2} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1880px',
            margin: '0 auto',
            padding: '0 0 0 0.75rem',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            minHeight: '114px',
            background: '#ffffff',
          }}
        >
          <Link
            href={`/${locale}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              padding: '0 1.25rem 0 0',
            }}
          >
            <img
              src="/logo-tiki-black.svg"
              alt="Tiki Village"
              style={{ height: '100px', width: 'auto', display: 'block' }}
            />
          </Link>

          <nav
            className="hidden md:flex"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1.8rem',
              padding: '0 1.4rem 0 0',
            }}
          >
            {navLinks.map(({ key, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={key}
                  href={`/${locale}${href === '/' ? '' : href}`}
                  style={{
                    color: '#3956cb',
                    fontFamily: 'Nohemi, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    paddingTop: '0.35rem',
                    paddingBottom: '0.85rem',
                    borderBottom: active ? '3px solid #f1bf2c' : '3px solid transparent',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}
                >
                  {t(key)}
                </Link>
              )
            })}

            <div
              className="hidden xl:flex"
              style={{
                alignItems: 'center',
                gap: '0.45rem',
                color: '#3956cb',
                fontFamily: 'Nohemi, sans-serif',
                fontSize: '0.78rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.12rem',
                }}
              >
                <span style={{ width: '6px', height: '12px', background: '#1f4ed8', display: 'inline-block' }} />
                <span style={{ width: '6px', height: '12px', background: '#ffffff', border: '1px solid #d8d8d8', display: 'inline-block' }} />
                <span style={{ width: '6px', height: '12px', background: '#dc2626', display: 'inline-block' }} />
              </span>
              <span>{localeLabel.toUpperCase()}</span>
            </div>

            <a
              href="#"
              aria-label="Panier"
              style={{
                color: '#6f7b96',
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '1rem',
              }}
            >
              <ShoppingCart size={24} strokeWidth={1.7} />
            </a>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              color: '#213056',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 1.25rem',
            }}
            aria-label="Menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div
            className="md:hidden"
            style={{
              background: '#ffffff',
              padding: '0.5rem 1.5rem 1.5rem',
              borderTop: '1px solid rgba(33,48,86,0.08)',
              boxShadow: '0 10px 18px rgba(10, 40, 80, 0.08)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: '0.85rem',
                padding: '0.75rem 0 1rem',
                borderBottom: '1px solid rgba(33,48,86,0.08)',
                color: '#314266',
                fontFamily: 'Nohemi, sans-serif',
                fontSize: '0.8rem',
              }}
            >
              <a href="https://maps.google.com/?q=PK%2031%20C%C3%B4t%C3%A9%20Mer%2C%20Haapiti%2C%20Moorea" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', color: '#314266', textDecoration: 'none' }}>
                <MapPin size={15} strokeWidth={2} />
                <span>PK 31 Côté Mer, Haapiti, Moorea</span>
              </a>
              <a href="mailto:accueil@tikivillage.pf" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', color: '#314266', textDecoration: 'none' }}>
                <Mail size={15} strokeWidth={2} />
                <span>accueil@tikivillage.pf</span>
              </a>
              <a href="tel:+68940550250" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', color: '#314266', textDecoration: 'none' }}>
                <Phone size={15} strokeWidth={2} />
                <span>+689 40 550 250</span>
              </a>
            </div>

            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={`/${locale}${href === '/' ? '' : href}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  color: '#3956cb',
                  fontFamily: 'Nohemi, sans-serif',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid rgba(33,48,86,0.08)',
                  textDecoration: 'none',
                }}
              >
                {t(key)}
              </Link>
            ))}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                paddingTop: '1rem',
              }}
            >
              <LocaleSwitcher />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a href="#" aria-label="Facebook" style={{ color: '#073f43' }}>
                  <Facebook size={18} strokeWidth={2.2} />
                </a>
                <a href="#" aria-label="Instagram" style={{ color: '#073f43' }}>
                  <Instagram size={18} strokeWidth={2.2} />
                </a>
                <a href="#" aria-label="YouTube" style={{ color: '#073f43' }}>
                  <Youtube size={18} strokeWidth={2.2} />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <div style={{ height: '176px' }} className="hidden md:block" aria-hidden />
      <div style={{ height: '144px' }} className="md:hidden" aria-hidden />
    </>
  )
}
