import React from 'react'

export const Logo: React.FC = () => {
  return (
    <a href="/fr" title="Retour à l'accueil">
      <img
        src="/logo-tiki-black.svg"
        alt="Tiki Village"
        style={{ height: '60px', width: 'auto' }}
      />
    </a>
  )
}

export default Logo
