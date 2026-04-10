import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Props = {
  locale: string
  page: RequiredDataFromCollectionSlug<'pages'>
}

type Section = {
  title: string
  body: string[]
  imageSrc: string
  imageAlt: string
  reverse?: boolean
  dark?: boolean
}

const copy = {
  fr: {
    eyebrow: 'VENEZ DECOUVRIR LE FABULEUX',
    title: 'SHOW POLYNESIEN',
    subtitle:
      "Un grand spectacle vivant entre chants, danses, feu, émotions et traditions au coucher du soleil sur Moorea.",
    cta: 'RESERVER',
    introTitle: "UNE SOIREE QUI FAIT VIBRER L'AME DE LA POLYNESIE",
    introBody: [
      "Imaginez le soleil qui se couche doucement sur Moorea, les premières notes des ukulélés qui résonnent et l'énergie d'un grand spectacle qui vous emporte dès les premières secondes.",
      "Au Tiki Village, le show polynésien est bien plus qu'une représentation : c'est une expérience partagée, faite de légendes dansées, de chants vibrants, de percussions et d'une générosité profondément polynésienne.",
    ],
    sections: [
      {
        title: 'UN SPECTACLE ENTRE TRADITION ET EMOTION',
        body: [
          "Le spectacle vous plonge dans l'univers des récits polynésiens à travers une mise en scène intense, colorée et généreuse.",
          "Chaque tableau raconte un fragment d'histoire : la force des guerriers, la grâce des danseuses, les rythmes du To'ere et la beauté du feu dans la nuit.",
        ],
        imageSrc: '/images/show-1.jpg',
        imageAlt: 'Danse polynésienne au Tiki Village',
      },
      {
        title: 'UNE AMBIANCE UNIQUE AU BORD DU LAGON',
        body: [
          "Avant même le lever de rideau, l'atmosphère de Moorea fait déjà partie du spectacle : lumière dorée, lagon, accueil chaleureux et musique live.",
          'Cette scénographie naturelle donne au show une intensité particulière, fidèle à la magie visible sur le site source.',
        ],
        imageSrc: '/images/soiree.jpg',
        imageAlt: 'Soirée polynésienne au bord du lagon',
        reverse: true,
        dark: true,
      },
      {
        title: 'LA TROUPE DU TIKI VILLAGE',
        body: [
          "La troupe du village s'est illustrée bien au-delà de Moorea. Son énergie, sa précision et sa présence scénique ont fait rayonner la culture polynésienne à l'international.",
          "Le spectacle restitue cette exigence artistique avec une vraie proximité humaine : ici, on ne regarde pas seulement un show, on le ressent.",
        ],
        imageSrc: '/images/show-3.jpg',
        imageAlt: 'La troupe du Tiki Village',
      },
      {
        title: 'DINER, FEU ET MEMOIRES INOUBLIABLES',
        body: [
          "La soirée se prolonge dans une expérience complète mêlant gastronomie tahitienne, musique, danse et final flamboyant.",
          "C'est le genre de moment qui marque un séjour : un souvenir fort, chaleureux et profondément ancré dans l'identité polynésienne.",
        ],
        imageSrc: '/images/show-4.jpg',
        imageAlt: 'Final du show polynésien',
        reverse: true,
      },
    ] as Section[],
    bottomTitle: 'RESERVEZ VOTRE SOIREE POLYNESIENNE',
    bottomBody:
      'Choisissez votre prestation, découvrez les détails de la soirée et préparez votre moment fort à Moorea.',
    bottomPrimary: 'VOIR LES PRESTATIONS',
    bottomSecondary: 'NOUS CONTACTER',
  },
  en: {
    eyebrow: 'COME DISCOVER THE FABULOUS',
    title: 'POLYNESIAN SHOW',
    subtitle:
      'A vibrant live performance of chants, dances, fire, emotion and traditions at sunset in Moorea.',
    cta: 'BOOK NOW',
    introTitle: 'AN EVENING THAT BRINGS POLYNESIA TO LIFE',
    introBody: [
      'Imagine the sun setting over Moorea, the first ukulele notes in the air, and the energy of a grand show carrying you away from the first seconds.',
      'At Tiki Village, the Polynesian show is much more than a performance: it is a shared experience of legends, songs, drums and heartfelt hospitality.',
    ],
    sections: [
      {
        title: 'A SHOW OF TRADITION AND EMOTION',
        body: [
          'The performance immerses you in Polynesian stories through an intense, colorful and generous staging.',
          'Each scene reveals a fragment of heritage: warriors, dancers, percussion, songs and the beauty of fire at night.',
        ],
        imageSrc: '/images/show-1.jpg',
        imageAlt: 'Polynesian dance performance',
      },
      {
        title: 'A UNIQUE LAGOON-SIDE ATMOSPHERE',
        body: [
          'Even before the show begins, Moorea already sets the stage with golden light, lagoon views, live music and warm hospitality.',
          'This natural setting gives the performance a very special intensity, close to the original source site.',
        ],
        imageSrc: '/images/soiree.jpg',
        imageAlt: 'Lagoon-side Polynesian evening',
        reverse: true,
        dark: true,
      },
      {
        title: 'THE TIKI VILLAGE TROUPE',
        body: [
          'The troupe has carried Polynesian culture far beyond Moorea through the strength of its performances and artistic discipline.',
          'Here, that same stage presence is combined with proximity and warmth: you do not just watch the show, you feel part of it.',
        ],
        imageSrc: '/images/show-3.jpg',
        imageAlt: 'Tiki Village troupe',
      },
      {
        title: 'DINNER, FIRE AND LASTING MEMORIES',
        body: [
          'The evening unfolds as a complete experience with Tahitian cuisine, live music, dance and a spectacular finale.',
          'It is the kind of experience that becomes one of the strongest memories of a stay in Moorea.',
        ],
        imageSrc: '/images/show-4.jpg',
        imageAlt: 'Polynesian show finale',
        reverse: true,
      },
    ] as Section[],
    bottomTitle: 'BOOK YOUR POLYNESIAN EVENING',
    bottomBody:
      'Browse the available experiences, discover what is included and plan one of the highlights of your stay in Moorea.',
    bottomPrimary: 'VIEW SERVICES',
    bottomSecondary: 'CONTACT US',
  },
  ja: {
    eyebrow: 'ポリネシアン ショーへようこそ',
    title: 'ショー ポリネシアン',
    subtitle:
      'モーレアの夕暮れに、歌、踊り、炎、感動、そして伝統が一つになる特別なライブショーです。',
    cta: '予約する',
    introTitle: 'ポリネシアの魂が響く特別な夜',
    introBody: [
      'モーレアの夕日、ウクレレの音色、そして始まった瞬間から引き込まれる舞台の熱気を想像してください。',
      'ティキ・ヴィレッジのショーは、単なる公演ではなく、伝説、歌、太鼓、そして人の温かさを共有する文化体験です。',
    ],
    sections: [
      {
        title: '伝統と感動のスペクタクル',
        body: [
          'ショーは、ポリネシアの物語を色鮮やかで力強い演出で描き出します。',
          '戦士、ダンサー、打楽器、歌、炎のシーンが連なり、文化の豊かさを体感できます。',
        ],
        imageSrc: '/images/show-1.jpg',
        imageAlt: 'ポリネシアンダンスショー',
      },
      {
        title: 'ラグーン沿いの唯一無二の空気感',
        body: [
          '開演前から、モーレアの光、ラグーン、ライブ音楽、歓迎の空気がすでに舞台の一部になっています。',
          'その自然の演出が、ショーをより忘れがたいものにしています。',
        ],
        imageSrc: '/images/soiree.jpg',
        imageAlt: 'ラグーン沿いの夜',
        reverse: true,
        dark: true,
      },
      {
        title: 'ティキ・ヴィレッジのトゥループ',
        body: [
          'このトゥループは、モーレアを越えてポリネシア文化を伝えてきた実績を持っています。',
          '高い表現力と親しみやすさが共存し、観客はショーの一部としてその熱量を感じられます。',
        ],
        imageSrc: '/images/show-3.jpg',
        imageAlt: 'ティキ・ヴィレッジの出演者たち',
      },
      {
        title: 'ディナー、炎、そして忘れられない記憶',
        body: [
          '夜はタヒチ料理、音楽、ダンス、そして印象的なフィナーレへとつながっていきます。',
          'モーレア滞在の中でも特別な思い出になる体験です。',
        ],
        imageSrc: '/images/show-4.jpg',
        imageAlt: 'ショーのフィナーレ',
        reverse: true,
      },
    ] as Section[],
    bottomTitle: 'ポリネシアン ナイトを予約する',
    bottomBody:
      '内容を確認し、ご滞在に合ったプランを選んで、モーレアでの印象的な夜を準備してください。',
    bottomPrimary: 'プランを見る',
    bottomSecondary: 'お問い合わせ',
  },
} as const

const getHeroMedia = (page: RequiredDataFromCollectionSlug<'pages'>): MediaType | null => {
  if (typeof page.hero?.media === 'object' && page.hero.media) {
    return page.hero.media
  }

  const mediaBlock = page.layout.find((block) => block.blockType === 'mediaBlock')
  if (mediaBlock && typeof mediaBlock.media === 'object' && mediaBlock.media) {
    return mediaBlock.media
  }

  return null
}

export function ShowPolynesienPageContent({ locale, page }: Props) {
  const text = copy[(locale as keyof typeof copy) || 'fr'] ?? copy.fr
  const heroMedia = getHeroMedia(page)

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden">
        <style>{`
          .show-hero-wave {
            position: absolute;
            left: 0;
            width: 100%;
            background: #ffffff;
            pointer-events: none;
            z-index: 10;
            -webkit-mask-image: url('/images/wave-brush.svg');
            mask-image: url('/images/wave-brush.svg');
            -webkit-mask-repeat: repeat-x;
            mask-repeat: repeat-x;
            -webkit-mask-size: 100% 100%;
            mask-size: 100% 100%;
          }
        `}</style>

        <div className="absolute inset-0">
          {heroMedia ? (
            <Media
              fill
              priority
              resource={heroMedia}
              imgClassName="object-cover [object-position:center_28%]"
              videoClassName="h-full w-full object-cover [object-position:center_28%]"
            />
          ) : (
            <img
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-[center_28%]"
              src="/images/show-2.jpg"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,22,28,0.62)_0%,rgba(0,22,28,0.28)_48%,rgba(0,22,28,0.14)_100%)]" />
        </div>

        <div className="relative z-[1] mx-auto flex min-h-[66vh] w-full max-w-[1600px] items-end px-6 pb-24 pt-28 md:px-10 lg:min-h-[74vh] lg:pb-28 xl:px-16">
          <div className="max-w-[980px] text-white">
            <p className="mb-4 font-['Roboto_Condensed',sans-serif] text-[18px] font-light uppercase tracking-[0.4em] text-white/95 md:text-[20px]">
              {text.eyebrow}
            </p>
            <h1 className="mb-4 font-[Roboto,sans-serif] text-[clamp(3.4rem,8vw,6.75rem)] font-black uppercase leading-[0.95] tracking-[0.18em] text-white">
              {text.title}
            </h1>
            <p className="mb-8 max-w-[980px] font-[Dosis,sans-serif] text-[22px] font-normal uppercase leading-[1.35] tracking-[0.06em] text-white md:text-[26px]">
              {text.subtitle}
            </p>
            <CMSLink
              appearance="default"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#f5c842] bg-[#f5c842] px-8 py-3 font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#1c244b] no-underline transition hover:border-[#fff1b8] hover:bg-[#fff1b8]"
              label={text.cta}
              type="custom"
              url={`/${locale}/prestations`}
            />
          </div>
        </div>

        <div
          aria-hidden
          className="show-hero-wave bottom-0 h-[58px] [transform:scaleY(-1)] md:h-[66px]"
        />
      </section>

      <section className="px-6 py-20 md:px-10 xl:px-16">
        <div className="mx-auto max-w-[1240px]">
          <img
            alt=""
            aria-hidden
            className="mb-6 w-[92px]"
            src="/images/bg-frise-horiz-v2-1280.svg"
          />
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <h2 className="max-w-[16ch] font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.12] text-[#033537]">
              {text.introTitle}
            </h2>
            <div className="prose max-w-none text-[#818181]">
              {text.introBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-0">
        {text.sections.map((section, index) => {
          const image = (
            <div className="relative min-h-[360px] overflow-hidden lg:min-h-[520px]">
              <img
                alt={section.imageAlt}
                className="h-full w-full object-cover"
                src={section.imageSrc}
              />
            </div>
          )

          const content = (
            <div
              className={`flex min-h-[360px] items-center px-6 py-16 md:px-10 lg:min-h-[520px] lg:px-16 xl:px-20 ${
                section.dark ? 'bg-[#495338] text-white' : 'bg-[#f7f6f0] text-[#033537]'
              }`}
            >
              <div className="max-w-[720px]">
                <img
                  alt=""
                  aria-hidden
                  className="mb-6 w-[84px]"
                  src="/images/bg-frise-horiz-v2-1280.svg"
                />
                <h2
                  className={`mb-8 max-w-[18ch] font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.08] ${
                    section.dark ? 'text-white' : 'text-[#033537]'
                  }`}
                >
                  {section.title}
                </h2>
                <div className={`prose max-w-none ${section.dark ? 'text-white/85' : 'text-[#818181]'}`}>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          )

          return (
            <div className="grid lg:grid-cols-2" key={`${section.title}-${index}`}>
              {section.reverse ? (
                <>
                  {content}
                  {image}
                </>
              ) : (
                <>
                  {image}
                  {content}
                </>
              )}
            </div>
          )
        })}
      </section>

      <section className="relative overflow-hidden bg-[#033537] px-6 py-20 text-center md:px-10 xl:px-16">
        <img
          alt=""
          aria-hidden
          className="absolute left-0 top-0 h-full opacity-[0.15]"
          src="/images/bg-tapa-vertical-gauche-v2-1280.svg"
        />
        <img
          alt=""
          aria-hidden
          className="absolute right-0 top-0 h-full opacity-[0.15]"
          src="/images/bg-tapa-vertical-v2-1280.svg"
        />
        <div className="relative z-[1] mx-auto max-w-[980px]">
          <img
            alt=""
            aria-hidden
            className="mx-auto mb-6 w-[92px]"
            src="/images/bg-frise-horiz-v2-1280.svg"
          />
          <h2 className="mx-auto mb-6 max-w-[20ch] font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.08] text-white">
            {text.bottomTitle}
          </h2>
          <p className="mx-auto mb-10 max-w-[760px] font-[Dosis,sans-serif] text-[25px] leading-[1.6] text-white/80">
            {text.bottomBody}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CMSLink
              appearance="default"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#f5c842] bg-[#f5c842] px-8 py-3 font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#1c244b] no-underline transition hover:border-[#fff1b8] hover:bg-[#fff1b8]"
              label={text.bottomPrimary}
              type="custom"
              url={`/${locale}/prestations`}
            />
            <CMSLink
              appearance="default"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#8cc63f] bg-[#8cc63f] px-8 py-3 font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#173118] no-underline transition hover:border-[#76ad2f] hover:bg-[#76ad2f]"
              label={text.bottomSecondary}
              type="custom"
              url={`/${locale}/contact`}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
