'use client'
import { useState } from 'react'
import { useLocale } from './LocaleProvider'

export function ContactForm() {
  const { t } = useLocale()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) { setStatus('sent'); form.reset() }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.8rem 0',
    fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#111',
    background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.15)', outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: '0.65rem',
    letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999',
    display: 'block', marginBottom: '0.5rem',
  }

  if (status === 'sent') return (
    <div style={{ padding: '3rem 0' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: '#111', marginBottom: '0.5rem' }}>
        {t('contact.sent_title')}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#999' }}>
        {t('contact.sent_desc')}
      </p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {[
        { name: 'name',    label: t('contact.name'),    type: 'text',  placeholder: t('contact.name') },
        { name: 'email',   label: t('contact.email'),   type: 'email', placeholder: 'email@example.com' },
        { name: 'subject', label: t('contact.subject'), type: 'text',  placeholder: t('contact.subject') },
      ].map((field) => (
        <div key={field.name}>
          <label style={labelStyle}>{field.label}</label>
          <input type={field.type} name={field.name} placeholder={field.placeholder}
            required={field.name !== 'subject'} style={inputStyle} />
        </div>
      ))}
      <div>
        <label style={labelStyle}>{t('contact.message')}</label>
        <textarea name="message" placeholder={t('contact.message')} rows={5} required
          style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {status === 'error' && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#c00' }}>
          {t('contact.error')}
        </p>
      )}

      <button type="submit" disabled={status === 'sending'}
        style={{ alignSelf: 'flex-start', marginTop: '1rem',
          fontFamily: 'var(--font-body)', fontSize: '0.65rem',
          letterSpacing: '0.3em', textTransform: 'uppercase',
          border: '1px solid #111', padding: '0.9rem 2.5rem',
          background: status === 'sending' ? '#111' : 'transparent',
          color: status === 'sending' ? 'white' : '#111',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s' }}>
        {status === 'sending' ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  )
}
