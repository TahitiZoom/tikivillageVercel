export default function MaintenancePage() {
  return (
    <div style={{
      background: '#080808', color: '#f2ede4',
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', fontFamily: 'Georgia, serif',
    }}>
      <div style={{ padding: '2rem', maxWidth: '600px' }}>
        <img src="/Logo-Tahiti-Zoom-144x144.png" alt="TZ"
          style={{ width: '80px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
        <img src="/logo-signature.png" alt="Tahiti Zoom"
          style={{ width: '300px', height: 'auto', maxWidth: '90%', display: 'block', margin: '0 auto 0.3rem' }} />
        <p style={{ fontSize: 'clamp(0.45rem,1.5vw,0.75rem)', whiteSpace: 'nowrap',
          letterSpacing: '0.3em', color: '#777', marginBottom: '2rem' }}>
          STÉPHANE SAYEB · PHOTOGRAPHE & DÉVELOPPEUR FULL STACK
        </p>
        <div style={{ border: '1px solid rgba(201,169,110,0.3)', padding: '0.8rem 2rem',
          display: 'inline-block', letterSpacing: '0.4em', fontSize: '0.65rem',
          textTransform: 'uppercase', color: '#c9a96e' }}>
          Bientôt — votre nouveau site web arrive
        </div>
        <p style={{ marginTop: '3rem', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#555' }}>
          Polynésie française ·{' '}
          <a href="mailto:contact@tahitizoom.pf" style={{ color: '#c9a96e', textDecoration: 'none' }}>
            contact@tahitizoom.pf
          </a>
        </p>
      </div>
    </div>
  )
}
