import React from 'react'

const BeforeLogin: React.FC = () => {
  return (
    <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            background: 'linear-gradient(135deg, #D4504A, #FFA500)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          TV
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.5rem', color: '#D4504A' }}>
          Tiki Village
        </span>
      </div>
      <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
        Administration du site — Tahiti, Polynésie française
      </p>
    </div>
  )
}

export default BeforeLogin
