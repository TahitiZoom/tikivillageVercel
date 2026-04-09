import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Bienvenue sur le tableau de bord Tiki Village</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' — initialise le contenu de démonstration (pages, articles, médias).'}
        </li>
        <li>
          {'Accédez au '}
          <a href="/fr" target="_blank">
            site public
          </a>
          {' pour vérifier le rendu frontend.'}
        </li>
        <li>
          {'Les langues disponibles sont '}
          <strong>Français (FR)</strong>
          {', '}
          <strong>English (EN)</strong>
          {' et '}
          <strong>日本語 (JA)</strong>
          {'. Sélectionnez la langue dans chaque document pour saisir les traductions.'}
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
