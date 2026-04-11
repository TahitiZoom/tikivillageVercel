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
    setHeaderTheme('light')
  })

  return (
    <div
      className="relative -mt-[11rem] overflow-hidden text-white"
      data-theme="light"
    >
      <style>{`
        .hero-wave {
          position: absolute;
          left: 0;
          width: 100%;
          background: #ffffff;
          pointer-events: none;
          z-index: 20;
          -webkit-mask-image: url('/images/wave-brush.svg');
          mask-image: url('/images/wave-brush.svg');
          -webkit-mask-repeat: repeat-x;
          mask-repeat: repeat-x;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }

        .hero-wave-bottom {
          bottom: 0;
          height: 52px;
          transform: scaleY(-1);
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0.95rem 2rem;
          border-radius: 999px;
          border: 1px solid #f5c842;
          background: #f5c842;
          color: #1c244b !important;
          font-family: "Roboto Condensed", sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none !important;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .hero-cta:hover {
          background: #fff2b8;
          border-color: #fff2b8;
          color: #11203f !important;
        }

        .hero-cta-secondary {
          background: #8cc63f;
          border-color: #8cc63f;
          color: #173118 !important;
        }

        .hero-cta-secondary:hover {
          background: #76ad2f;
          border-color: #76ad2f;
          color: #0f2410 !important;
        }
      `}</style>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end pb-10 pl-3 pr-6 md:pb-12 md:pl-5 xl:pb-14 xl:pl-8">
        <div className="max-w-[96rem]">
          {richText && (
            <RichText
              className="mb-4 max-w-none text-left [&_h1]:m-0 [&_h1]:font-[Roboto,sans-serif] [&_h1]:text-[clamp(3.4rem,8vw,6.75rem)] [&_h1]:font-black [&_h1]:uppercase [&_h1]:leading-[0.95] [&_h1]:tracking-[0.18em] [&_h1]:text-white [&_h2]:mb-4 [&_h2]:font-['Roboto_Condensed',sans-serif] [&_h2]:text-[18px] [&_h2]:font-light [&_h2]:uppercase [&_h2]:tracking-[0.4em] [&_h2]:text-white/95 md:[&_h2]:text-[20px] [&_p]:mb-0 [&_p]:whitespace-nowrap [&_p]:font-[Dosis,sans-serif] [&_p]:text-[22px] [&_p]:font-normal [&_p]:uppercase [&_p]:leading-[1.35] [&_p]:tracking-[0.06em] [&_p]:text-white md:[&_p]:text-[26px]"
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {links.map(({ link }, i) => {
                const isContactButton =
                  typeof link?.label === 'string' &&
                  link.label.toLowerCase().includes('contacter')

                return (
                  <li key={i}>
                    <CMSLink
                      {...link}
                      className={`hero-cta${isContactButton ? ' hero-cta-secondary' : ''}`}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="min-h-[94vh] select-none md:min-h-[96vh]">
        {media && typeof media === 'object' && (
          <Media
            fill
            imgClassName="-z-10 object-cover [object-position:center_22%]"
            priority
            resource={media}
          />
        )}
      </div>

      <div aria-hidden className="hero-wave hero-wave-bottom" />
    </div>
  )
}
