'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-end justify-start text-white min-h-screen"
      data-theme="dark"
    >
      {/* Image de fond */}
      <div className="absolute inset-0">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="object-cover" priority resource={media} />
        )}
        {/* Dégradé sombre en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="container relative z-10 pb-20 pt-40">
        <div className="max-w-3xl">
          {richText && (
            <RichText
              className="mb-8 [&_h1]:text-5xl [&_h1]:md:text-7xl [&_h1]:font-light [&_h1]:tracking-tight [&_h1]:leading-none [&_p]:text-lg [&_p]:text-white/70 [&_p]:mt-4"
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-4 mt-8">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink
                    {...link}
                    className="border border-white/30 px-6 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Indicateur scroll */}
        <div className="flex items-center gap-3 mt-16">
          <div className="w-8 h-px bg-white/50" />
          <span className="text-xs tracking-widest uppercase text-white/50">Défiler</span>
        </div>
      </div>
    </div>
  )
}
