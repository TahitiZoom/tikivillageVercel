import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Media as MediaType, Page } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Props = {
  locale: string
  page: RequiredDataFromCollectionSlug<'pages'>
}

type Feature = {
  title: string
  body: string[]
  imageSrc: string
  imageAlt: string
  dark?: boolean
  reverse?: boolean
}

const copy = {
  fr: {
    eyebrow: 'MAEVA E MANAVA AU',
    title: 'CENTRE CULTUREL POLYNESIEN',
    subtitle:
      "Découvrez la culture polynésienne d'aujourd'hui et d'autrefois dans un lieu unique en bord de lagon.",
    introLabel: 'LA VISITE CULTURELLE',
    introTitle: "UNE IMMERSION AUTHENTIQUE AU COEUR DE MOOREA",
    introLeft:
      "Bienvenue au Tiki Village, reconstitution d'un village polynésien d'antan avec son Marae, lieu de culte traditionnel. Vous pourrez y découvrir les différents Fare, l'artisanat local et les gestes culturels qui font l'âme de la Polynésie.",
    introRight:
      'Le restaurant Le Tiki en bord de lagon vous accueille du mardi au samedi pour déguster les spécialités tahitiennes. Une visite culturelle pensée pour toute la famille, entre patrimoine vivant, ateliers, danse et partage.',
    features: [
      {
        title: 'HISTORIQUE DU VILLAGE',
        body: [
          "Le village se situe dans la commune d'Haapiti, au sud-ouest de Moorea, dans une région encore très préservée.",
          "La visite commence par l'accueil et sa boutique d'artisanat, puis se prolonge au fil d'une vingtaine de Fare traditionnels où se raconte le Tahiti d'antan.",
        ],
        imageSrc: '/images/village.jpg',
        imageAlt: 'Vue du village polynésien',
      },
      {
        title: 'ATELIERS CULTURELS',
        body: [
          'Tressage, cuisine tahitienne, danse, musique et peinture de paréo : chaque atelier permet de découvrir un savoir-faire polynésien en famille.',
          "Ces expériences sont conçues comme de vrais moments de transmission, accessibles et vivants, dans l'esprit du site source.",
        ],
        imageSrc: '/images/centre-culturel/atelier-1.jpg',
        imageAlt: 'Atelier culturel au Tiki Village',
        dark: true,
        reverse: true,
      },
      {
        title: 'LES FARE ET LE MARAE',
        body: [
          "La promenade invite à explorer les fare traditionnels, les espaces d'exposition, la galerie photo et le Marae qui surplombe le lagon.",
          "Chaque étape raconte une facette du patrimoine polynésien : habitat, croyances, gestes quotidiens et mémoire des anciens.",
        ],
        imageSrc: '/images/tiki-village-2.jpg',
        imageAlt: 'Fare traditionnels du centre culturel',
      },
      {
        title: 'RESTAURANT DU LAGON',
        body: [
          "Le restaurant Le Tiki complète la visite dans un cadre exceptionnel en bord de lagon, avec une cuisine tahitienne généreuse et conviviale.",
          'Le centre culturel devient ainsi une expérience complète : découverte, spectacle, gastronomie et moments de partage.',
        ],
        imageSrc: '/images/hero-bg.webp',
        imageAlt: 'Restaurant en bord de lagon',
        reverse: true,
      },
    ] as Feature[],
    ctaEyebrow: 'RESERVATIONS',
    ctaTitle: 'RESERVEZ VOTRE VISITE, VOS ATELIERS OU VOTRE SHOW',
    ctaBody:
      'Retrouvez toutes nos prestations culturelles et réservez directement la formule la plus adaptée à votre séjour.',
    ctaPrimary: 'RESERVER',
    ctaSecondary: 'NOUS CONTACTER',
  },
  en: {
    eyebrow: 'MAEVA E MANAVA TO THE',
    title: 'POLYNESIAN CULTURAL CENTER',
    subtitle:
      "Discover Polynesian culture past and present in a unique lagoon-side setting.",
    introLabel: 'CULTURAL VISIT',
    introTitle: 'AN AUTHENTIC IMMERSION IN THE HEART OF MOOREA',
    introLeft:
      'Welcome to Tiki Village, a reconstruction of a traditional Polynesian village with its Marae, a sacred ceremonial site. Discover the Fare houses, local crafts and cultural gestures that shape Polynesian identity.',
    introRight:
      'The lagoon-side Le Tiki restaurant welcomes you from Tuesday to Saturday with Tahitian specialties. A cultural visit designed for the whole family, blending heritage, workshops, dance and sharing.',
    features: [
      {
        title: 'VILLAGE HISTORY',
        body: [
          'The village is located in Haapiti, on the south-west coast of Moorea, in one of the island’s most preserved areas.',
          'The tour begins at the welcome area and craft shop, then continues through traditional Fare houses that tell the story of old Tahiti.',
        ],
        imageSrc: '/images/village.jpg',
        imageAlt: 'View of the cultural village',
      },
      {
        title: 'CULTURAL WORKSHOPS',
        body: [
          'Weaving, Tahitian cooking, dance, music and pareo painting let visitors discover Polynesian know-how in a hands-on way.',
          'These workshops are designed as living moments of transmission, faithful to the spirit of the original site.',
        ],
        imageSrc: '/images/centre-culturel/atelier-1.jpg',
        imageAlt: 'Cultural workshop at Tiki Village',
        dark: true,
        reverse: true,
      },
      {
        title: 'FARE HOUSES AND THE MARAE',
        body: [
          'The walk leads through traditional fare houses, exhibition spaces, the photo gallery and the Marae overlooking the lagoon.',
          'Each stop reveals another aspect of Polynesian heritage: housing, beliefs, daily life and ancestral memory.',
        ],
        imageSrc: '/images/tiki-village-2.jpg',
        imageAlt: 'Traditional fare houses',
      },
      {
        title: 'LAGOON RESTAURANT',
        body: [
          'Le Tiki restaurant extends the experience in an exceptional lagoon-front setting with generous Tahitian cuisine.',
          'The cultural center becomes a complete experience: discovery, performances, gastronomy and warm hospitality.',
        ],
        imageSrc: '/images/hero-bg.webp',
        imageAlt: 'Lagoon-side restaurant',
        reverse: true,
      },
    ] as Feature[],
    ctaEyebrow: 'BOOKINGS',
    ctaTitle: 'BOOK YOUR VISIT, WORKSHOPS OR SHOW',
    ctaBody:
      'Browse our cultural experiences and choose the formula that best matches your stay in Moorea.',
    ctaPrimary: 'BOOK NOW',
    ctaSecondary: 'CONTACT US',
  },
  ja: {
    eyebrow: 'MAEVA E MANAVA',
    title: 'ポリネシアン カルチュラル センター',
    subtitle: 'ラグーン沿いの特別な空間で、昔と今のポリネシア文化を体験してください。',
    introLabel: 'カルチュラル ビジット',
    introTitle: 'モーレアの中心で出会う本物の文化体験',
    introLeft:
      'ティキ・ヴィレッジは、聖なるマラエを備えた昔ながらのポリネシアの村を再現した文化施設です。伝統家屋、工芸、暮らしの所作を通して文化の本質に触れられます。',
    introRight:
      'ラグーン沿いのレストラン「Le Tiki」では、火曜日から土曜日までタヒチ料理を楽しめます。家族みんなで学び、味わい、共有できる文化体験です。',
    features: [
      {
        title: 'ヴィレッジの歴史',
        body: [
          '村はモーレア島南西部のハアピティ地区にあり、今も自然豊かな環境が残っています。',
          '見学は受付と工芸ショップから始まり、伝統的なファレを巡りながら昔のタヒチの物語に触れていきます。',
        ],
        imageSrc: '/images/village.jpg',
        imageAlt: '文化村の風景',
      },
      {
        title: 'カルチュラル ワークショップ',
        body: [
          '編み物、タヒチ料理、ダンス、音楽、パレオペイントなど、体験型のワークショップでポリネシアの知恵を学べます。',
          'どの体験も、伝承と交流を大切にした温かなプログラムとして構成されています。',
        ],
        imageSrc: '/images/centre-culturel/atelier-1.jpg',
        imageAlt: '文化ワークショップ',
        dark: true,
        reverse: true,
      },
      {
        title: 'ファレとマラエ',
        body: [
          '散策では、伝統的なファレ、展示空間、フォトギャラリー、そしてラグーンを見渡すマラエを訪れます。',
          '住まい、信仰、日々の営み、祖先の記憶など、ポリネシア文化の多面性が見えてきます。',
        ],
        imageSrc: '/images/tiki-village-2.jpg',
        imageAlt: '伝統家屋と文化空間',
      },
      {
        title: 'ラグーン レストラン',
        body: [
          'Le Tiki レストランでは、ラグーン沿いの景色とともにタヒチ料理をゆっくり味わえます。',
          '文化、ショー、食、もてなしが一つにつながる総合的な体験です。',
        ],
        imageSrc: '/images/hero-bg.webp',
        imageAlt: 'ラグーン沿いのレストラン',
        reverse: true,
      },
    ] as Feature[],
    ctaEyebrow: '予約',
    ctaTitle: '見学・ワークショップ・ショーを予約する',
    ctaBody: 'ティキ・ヴィレッジの体験一覧から、ご滞在に合ったプランをお選びください。',
    ctaPrimary: '予約する',
    ctaSecondary: 'お問い合わせ',
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

export function CentreCulturelPageContent({ locale, page }: Props) {
  const text = copy[(locale as keyof typeof copy) || 'fr'] ?? copy.fr
  const heroMedia = getHeroMedia(page)

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden">
        <style>{`
          .centre-hero-wave {
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
              imgClassName="object-cover [object-position:center_32%]"
              videoClassName="h-full w-full object-cover [object-position:center_32%]"
            />
          ) : (
            <img
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-[center_32%]"
              src="/images/village.jpg"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,53,55,0.68)_0%,rgba(3,53,55,0.34)_45%,rgba(3,53,55,0.18)_100%)]" />
        </div>

        <div className="relative z-[1] mx-auto flex min-h-[68vh] w-full max-w-[1600px] items-end px-6 pb-24 pt-28 md:px-10 lg:min-h-[76vh] lg:pb-28 xl:px-16">
          <div className="max-w-[980px] text-white">
            <p className="mb-4 font-['Roboto_Condensed',sans-serif] text-[18px] font-light uppercase tracking-[0.4em] text-white/95 md:text-[20px]">
              {text.eyebrow}
            </p>
            <h1 className="mb-4 font-[Roboto,sans-serif] text-[clamp(3.4rem,8vw,6.75rem)] font-black uppercase leading-[0.95] tracking-[0.18em] text-white">
              {text.title}
            </h1>
            <p className="max-w-[980px] font-[Dosis,sans-serif] text-[22px] font-normal uppercase leading-[1.35] tracking-[0.06em] text-white md:text-[26px]">
              {text.subtitle}
            </p>
          </div>
        </div>

        <div
          aria-hidden
          className="centre-hero-wave bottom-0 h-[58px] [transform:scaleY(-1)] md:h-[66px]"
        />
      </section>

      <section className="px-6 py-20 md:px-10 xl:px-16">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <img
              alt=""
              aria-hidden
              className="mb-6 w-[92px]"
              src="/images/bg-frise-horiz-v2-1280.svg"
            />
            <p className="mb-5 font-['Roboto_Condensed',sans-serif] text-[16px] font-light uppercase tracking-[0.35em] text-[#10ccae]">
              {text.introLabel}
            </p>
            <h2 className="max-w-[14ch] font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.12] text-[#033537]">
              {text.introTitle}
            </h2>
          </div>

          <div className="grid gap-6 text-[#818181] md:grid-cols-2 md:gap-10">
            <div className="prose max-w-none">
              <p>{text.introLeft}</p>
            </div>
            <div className="prose max-w-none">
              <p>{text.introRight}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-0">
        {text.features.map((feature, index) => {
          const image = (
            <div className="relative min-h-[360px] overflow-hidden lg:min-h-[520px]">
              <img
                alt={feature.imageAlt}
                className="h-full w-full object-cover"
                src={feature.imageSrc}
              />
            </div>
          )

          const content = (
            <div
              className={`flex min-h-[360px] items-center px-6 py-16 md:px-10 lg:min-h-[520px] lg:px-16 xl:px-20 ${
                feature.dark ? 'bg-[#495338] text-white' : 'bg-[#f7f6f0] text-[#033537]'
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
                    feature.dark ? 'text-white' : 'text-[#033537]'
                  }`}
                >
                  {feature.title}
                </h2>
                <div className={`prose max-w-none ${feature.dark ? 'text-white/85' : 'text-[#818181]'}`}>
                  {feature.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          )

          return (
            <div
              className="grid lg:grid-cols-2"
              key={`${feature.title}-${index}`}
            >
              {feature.reverse ? (
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
          <p className="mb-5 font-['Roboto_Condensed',sans-serif] text-[16px] font-light uppercase tracking-[0.35em] text-[#10ccae]">
            {text.ctaEyebrow}
          </p>
          <h2 className="mx-auto mb-6 max-w-[20ch] font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.08] text-white">
            {text.ctaTitle}
          </h2>
          <p className="mx-auto mb-10 max-w-[760px] font-[Dosis,sans-serif] text-[25px] leading-[1.6] text-white/80">
            {text.ctaBody}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CMSLink
              appearance="default"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#f5c842] bg-[#f5c842] px-8 py-3 font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#1c244b] no-underline transition hover:border-[#fff1b8] hover:bg-[#fff1b8]"
              label={text.ctaPrimary}
              type="custom"
              url={`/${locale}/prestations`}
            />
            <CMSLink
              appearance="default"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#8cc63f] bg-[#8cc63f] px-8 py-3 font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#173118] no-underline transition hover:border-[#76ad2f] hover:bg-[#76ad2f]"
              label={text.ctaSecondary}
              type="custom"
              url={`/${locale}/contact`}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
