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
  {
    key: 'reservations',
    href: '/reservations',
    subItems: [
      { key: 'nosPrestations', href: '/prestations', label: 'NOS PRESTATIONS' },
      { key: 'monCompte', href: '/mon-compte', label: 'MON COMPTE' },
    ],
  },
  { key: 'contact', href: '/contact' },
]

export const HeaderClient: React.FC = () => {
  const locale = useLocale()
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const headerTextStyle = {
    fontFamily: '"Poppins", Sans-serif',
    fontSize: '16px',
    fontWeight: 300,
    textTransform: 'none' as const,
    fontStyle: 'normal',
    textDecoration: 'none',
    lineHeight: '1.5em',
    letterSpacing: 0,
    color: '#1c244b',
  }

  const desktopNavTextStyle = {
    fontFamily: '"Roboto Condensed", sans-serif',
    fontSize: '20px',
    fontWeight: 400,
    textTransform: 'uppercase' as const,
    fontStyle: 'normal',
    textDecoration: 'none',
    lineHeight: '1.5em',
    letterSpacing: 0,
    color: '#4054b2',
  }

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
          overflow: 'visible',
        }}
      >
        <style>{`
          .header-nav-link {
            transition:
              color 0.2s ease,
              border-color 0.2s ease,
              text-shadow 0.2s ease;
          }

          .header-nav-link:hover {
            color: #4054b2 !important;
            border-bottom-color: #f1bf2c !important;
          }

          .header-nav-item {
            position: relative;
          }

          .header-submenu {
            position: absolute;
            top: calc(100% + 6px);
            left: 50%;
            transform: translateX(-50%);
            min-width: 232px;
            background: #ffffff;
            box-shadow: 0 16px 28px rgba(20, 35, 70, 0.14);
            border: 1px solid rgba(64, 84, 178, 0.08);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            z-index: 90;
          }

          .header-nav-item:hover .header-submenu {
            opacity: 1;
            visibility: visible;
          }

          .header-submenu-link {
            display: block;
            padding: 0.95rem 1rem;
            color: #4054b2;
            font-family: "Roboto Condensed", sans-serif;
            font-size: 18px;
            font-weight: 400;
            text-transform: uppercase;
            line-height: 1.4;
            text-decoration: none;
            border-bottom: 1px solid rgba(64, 84, 178, 0.08);
            transition: background-color 0.2s ease, color 0.2s ease;
            white-space: nowrap;
          }

          .header-submenu-link:hover {
            background: #f7f9ff;
            color: #24337b;
          }

          .header-wave-bottom {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -34px;
            height: 34px;
            background: #ffffff;
            pointer-events: none;
            z-index: 60;
            -webkit-mask-image: url('/images/wave-brush.svg');
            mask-image: url('/images/wave-brush.svg');
            -webkit-mask-repeat: repeat-x;
            mask-repeat: repeat-x;
            -webkit-mask-size: 100% 100%;
            mask-size: 100% 100%;
            transform: scaleX(-1);
          }
        `}</style>

        <div
          style={{
            background: '#c8dcee',
            color: '#314266',
            minHeight: '56px',
          }}
        >
          <div
            style={{
              maxWidth: '1600px',
              margin: '0 auto',
              padding: '0 2rem',
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontFamily: 'Nohemi, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            <div className="hidden lg:flex" style={{ flex: 1, justifyContent: 'center' }}>
              <a
                href="https://maps.google.com/?q=PK%2031%20C%C3%B4t%C3%A9%20Mer%2C%20Haapiti%2C%20Moorea"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  ...headerTextStyle,
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
                  ...headerTextStyle,
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
                justifyContent: 'center',
                gap: '1.3rem',
              }}
            >
              <a
                href="tel:+68940550250"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  ...headerTextStyle,
                  whiteSpace: 'nowrap',
                }}
              >
                <Phone size={14} strokeWidth={2.2} color="#213056" />
                <span>+689 40 550 250</span>
              </a>

              <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '1rem' }}>
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
              gap: '1.65rem',
              padding: '0 1.4rem 0 0',
            }}
          >
            {navLinks.map(({ key, href, subItems }) => {
              const active = isActive(href)
              return (
                <div key={key} className="header-nav-item">
                  <Link
                    className="header-nav-link"
                    href={`/${locale}${href === '/' ? '' : href}`}
                    style={{
                      ...desktopNavTextStyle,
                      paddingTop: '0.35rem',
                      paddingBottom: '0.85rem',
                      borderBottom: active ? '3px solid #f1bf2c' : '3px solid transparent',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                    }}
                  >
                    {t(key)}
                  </Link>

                  {subItems?.length ? (
                    <div className="header-submenu">
                      {subItems.map((item) => (
                        <Link
                          key={item.key}
                          className="header-submenu-link"
                          href={`/${locale}${item.href}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}

            <div
              className="hidden xl:flex"
              style={{
                alignItems: 'center',
                whiteSpace: 'nowrap',
                marginLeft: '0.15rem',
              }}
            >
              <LocaleSwitcher variant="desktop" />
            </div>

            <Link
              href={`/${locale}/panier`}
              aria-label="Panier"
              style={{
                color: '#6f7b96',
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '1rem',
              }}
            >
              <ShoppingCart size={24} strokeWidth={1.7} />
            </Link>
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
              background: '#1c244b',
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
                <span style={headerTextStyle}>PK 31 Côté Mer, Haapiti, Moorea</span>
              </a>
              <a href="mailto:accueil@tikivillage.pf" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', color: '#314266', textDecoration: 'none' }}>
                <Mail size={15} strokeWidth={2} />
                <span style={headerTextStyle}>accueil@tikivillage.pf</span>
              </a>
              <a href="tel:+68940550250" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', color: '#314266', textDecoration: 'none' }}>
                <Phone size={15} strokeWidth={2} />
                <span style={headerTextStyle}>+689 40 550 250</span>
              </a>
            </div>

            {navLinks.map(({ key, href, subItems }) => (
              <div key={key}>
                <Link
                  href={`/${locale}${href === '/' ? '' : href}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    ...desktopNavTextStyle,
                    padding: '0.9rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {t(key)}
                </Link>
                {subItems?.length ? (
                  <div style={{ paddingLeft: '1rem', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
                    {subItems.map((item) => (
                      <Link
                        key={item.key}
                        href={`/${locale}${item.href}`}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          ...desktopNavTextStyle,
                          color: 'rgba(255,255,255,0.82)',
                          fontSize: '17px',
                          padding: '0.45rem 0',
                          display: 'block',
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
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
              <LocaleSwitcher variant="mobile" />
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

        <div aria-hidden className="header-wave-bottom" />
      </header>

      <div style={{ height: '176px' }} className="hidden md:block" aria-hidden />
      <div style={{ height: '144px' }} className="md:hidden" aria-hidden />
    </>
  )
}
