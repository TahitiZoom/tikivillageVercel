'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

type LocaleSwitcherProps = {
  variant?: 'desktop' | 'mobile'
}

const localeOptions = {
  fr: {
    label: 'FRANCAIS',
    menuLabel: 'FRANCAIS',
    flag: ['#1f4ed8', '#ffffff', '#dc2626'],
  },
  en: {
    label: 'ENGLISH',
    menuLabel: 'ENGLISH (ANGLAIS)',
    flag: ['#1f2937', '#dc2626', '#1f2937'],
  },
  ja: {
    label: 'JAPONAIS',
    menuLabel: '日本語 (JAPONAIS)',
    flag: ['#ffffff', '#dc2626', '#ffffff'],
  },
} as const

const baseTextStyle: React.CSSProperties = {
  fontFamily: '"Roboto Condensed", sans-serif',
  fontSize: '20px',
  fontWeight: 400,
  textTransform: 'uppercase',
  lineHeight: '1.3',
  letterSpacing: 0,
  color: '#4054b2',
}

function Flag({ colors }: { colors: readonly string[] }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.12rem',
        flexShrink: 0,
      }}
    >
      {colors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          style={{
            width: '6px',
            height: '12px',
            background: color,
            border: color === '#ffffff' ? '1px solid #d8d8d8' : 'none',
            display: 'inline-block',
            borderRadius: '1px',
          }}
        />
      ))}
    </span>
  )
}

const localeMenuItemStyle = `
  .locale-menu-item {
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .locale-menu-item:hover,
  .locale-menu-item:focus-visible {
    background: #4054b2 !important;
    color: #ffffff !important;
    outline: none;
  }

  .locale-menu-item:hover .locale-menu-item-label,
  .locale-menu-item:focus-visible .locale-menu-item-label {
    color: #ffffff !important;
  }
`

export const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({ variant = 'desktop' }) => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const current = useMemo(() => localeOptions[locale as keyof typeof localeOptions] ?? localeOptions.fr, [locale])

  const switchLocale = (newLocale: string) => {
    setOpen(false)
    router.replace(pathname, { locale: newLocale })
  }

  if (variant === 'mobile') {
    return (
      <div ref={rootRef} style={{ position: 'relative' }}>
        <style>{localeMenuItemStyle}</style>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            ...baseTextStyle,
            fontSize: '18px',
          }}
        >
          <Flag colors={current.flag} />
          <span>{current.label}</span>
        </button>

        {open && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 'calc(100% + 0.75rem)',
              minWidth: '240px',
              background: '#ffffff',
              boxShadow: '0 12px 30px rgba(28, 36, 75, 0.18)',
              border: '1px solid rgba(64, 84, 178, 0.12)',
              zIndex: 100,
            }}
          >
            {routing.locales.map((code) => {
              const option = localeOptions[code as keyof typeof localeOptions]
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchLocale(code)}
                  className="locale-menu-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.9rem 1rem',
                    background: code === locale ? '#f8f9ff' : '#ffffff',
                    border: 'none',
                    borderBottom: '1px solid rgba(64, 84, 178, 0.08)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: '"Roboto Condensed", sans-serif',
                    fontSize: '18px',
                    color: '#4c4c4c',
                  }}
                >
                  <Flag colors={option.flag} />
                  <span className="locale-menu-item-label">{option.menuLabel}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <style>{localeMenuItemStyle}</style>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0.35rem 0 0.85rem',
          ...baseTextStyle,
          whiteSpace: 'nowrap',
          borderBottom: open ? '3px solid #f1bf2c' : '3px solid transparent',
          transition: 'color 0.2s ease, border-color 0.2s ease',
        }}
      >
        <Flag colors={current.flag} />
        <span>{current.label}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% - 0.1rem)',
            minWidth: '204px',
            background: '#ffffff',
            boxShadow: '0 12px 30px rgba(28, 36, 75, 0.18)',
            border: '1px solid rgba(64, 84, 178, 0.12)',
            zIndex: 100,
          }}
        >
          {routing.locales.map((code) => {
            const option = localeOptions[code as keyof typeof localeOptions]
            return (
              <button
                key={code}
                type="button"
                onClick={() => switchLocale(code)}
                className="locale-menu-item"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.95rem 1rem',
                  background: code === locale ? '#f8f9ff' : '#ffffff',
                  border: 'none',
                  borderBottom: '1px solid rgba(64, 84, 178, 0.08)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: '"Roboto Condensed", sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#4c4c4c',
                  lineHeight: 1.2,
                }}
              >
                <Flag colors={option.flag} />
                <span className="locale-menu-item-label">{option.menuLabel}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
