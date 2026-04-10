import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Props = {
  locale: string
  page: RequiredDataFromCollectionSlug<'pages'>
}

type Package = {
  name: string
  tagline: string
  price: string
  note?: string
  highlights: string[]
}

const copy = {
  fr: {
    eyebrow: "VOTRE MARIAGE, C'EST UNE HISTOIRE D'",
    title: 'AMOUR INOUBLIABLE',
    subtitle:
      "Une cérémonie tahitienne au bord du lagon, entre émotion, traditions, musique et instants précieux à partager à deux.",
    heroCta: 'NOUS CONTACTER',
    introTitle: 'UNE CEREMONIE QUI RESSEMBLE A VOTRE HISTOIRE',
    introBody: [
      "Parce que chaque amour est unique, chaque mariage mérite d'être célébré avec une touche de magie. Au Tiki Village, nous imaginons des cérémonies à l'image de votre histoire : pleines d'émotions, de rires et de souvenirs appelés à durer.",
      "Dans le décor unique d'un village polynésien en bord de lagon, costumes traditionnels, chants tahitiens, tatouage, pirogue, massages et accueil en musique composent une expérience hors du temps.",
    ],
    sectionTitle: 'NOS FORMULES DE MARIAGE',
    sectionBody:
      "Découvrez plusieurs expériences pensées pour célébrer votre union à Moorea, de l'intimité la plus tendre à la grande cérémonie spectaculaire.",
    packageButton: 'NOUS CONTACTER POUR UN DEVIS',
    packages: [
      {
        name: 'MARIAGE INTIME',
        tagline: 'Une cérémonie simple, douce et émouvante pour vivre vos voeux en toute intimité.',
        price: '70 000 CFP',
        note: 'soit 586,60 EUR',
        highlights: [
          'Accueil en musique et essayage des costumes traditionnels',
          'Cérémonie au Marae avec 5 artistes, certificat tahitien et Tifaifai',
          '2 cocktails de mariage et invitation à la grande soirée polynésienne',
        ],
      },
      {
        name: 'MARIAGE TRADITION',
        tagline: "Une cérémonie plus ample et très polynésienne, avec accueil fleuri, musique et plus grande troupe.",
        price: '120 000 CFP',
        note: 'soit 1 005,61 EUR',
        highlights: [
          'Couronnes de fleurs, cocktail / punch et cérémonie avec 14 artistes',
          'Procession royale, chanteurs, danseurs et vue lagon depuis le Marae',
          'Invitation à la grande soirée polynésienne et options photo / vidéo',
        ],
      },
      {
        name: 'ARRIVEE PAR LE LAGON',
        tagline: "Une entrée spectaculaire en pirogue et une mise en scène grandiose sur la plage du village.",
        price: '160 000 CFP',
        note: 'soit 1 340,82 EUR',
        highlights: [
          'Arrivée par le lagon à bord d’une pirogue double accompagnée de 3 pirogues',
          'Tatouages, procession royale, champagne et balade romantique en pirogue',
          'Invitation à la grande soirée polynésienne et nombreuses options complémentaires',
        ],
      },
      {
        name: 'CEREMONIE PRESTIGE',
        tagline: 'Une célébration exceptionnelle et hors du temps, avec massage pour deux et show privé.',
        price: '195 000 CFP',
        note: 'soit 1 634,12 EUR',
        highlights: [
          'Arrivée par le lagon, 24 artistes, procession royale et champagne',
          'Show privé de danses traditionnelles et de feu, croisière romantique en pirogue',
          'Massage pour deux au fare bambou et invitation à la grande soirée polynésienne',
        ],
      },
    ] as Package[],
    romanceTitle: 'UNE EXPERIENCE ROMANTIQUE ET SCENOGRAPHIEE',
    romanceBody: [
      "Les mariages du Tiki Village ne sont pas pensés comme une simple prestation. Ils prolongent un imaginaire fort : l'arrivée par le lagon, les fleurs tropicales, le patchwork traditionnel, les chants et le rythme des percussions.",
      "Le résultat est très visuel, profondément polynésien et pensé pour marquer les mémoires. C'est ce mélange d'émotion et de mise en scène qui donne à la page source toute sa force.",
    ],
    finalTitle: 'PRETS A ECRIRE ENSEMBLE CE CHAPITRE INOUBLIABLE ?',
    finalBody:
      'Parlez-nous de votre projet et nous vous guiderons vers la formule la plus adaptée, avec tous les détails pratiques pour votre cérémonie à Moorea.',
    finalPrimary: 'NOUS CONTACTER',
    finalSecondary: 'VOIR LES PRESTATIONS',
  },
  en: {
    eyebrow: 'YOUR WEDDING IS A STORY OF',
    title: 'UNFORGETTABLE LOVE',
    subtitle:
      'A Tahitian ceremony by the lagoon, filled with emotion, traditions, music and precious moments to share together.',
    heroCta: 'CONTACT US',
    introTitle: 'A CEREMONY THAT FEELS LIKE YOUR STORY',
    introBody: [
      'Because every love story is unique, every wedding deserves a touch of magic. At Tiki Village, we design ceremonies that reflect your bond: emotional, joyful and made of lasting memories.',
      'In the unique setting of a Polynesian village by the lagoon, traditional costumes, Tahitian songs, tattoos, canoes, massages and musical welcomes create a timeless celebration.',
    ],
    sectionTitle: 'OUR WEDDING FORMULAS',
    sectionBody:
      'Explore several experiences created to celebrate your union in Moorea, from intimate tenderness to a truly spectacular ceremony.',
    packageButton: 'CONTACT US FOR A QUOTE',
    packages: [
      {
        name: 'INTIMATE WEDDING',
        tagline: 'A simple, graceful and emotional ceremony to celebrate your vows in privacy.',
        price: '70,000 XPF',
        note: 'about 586.60 EUR',
        highlights: [
          'Musical welcome and fitting of traditional outfits',
          'Ceremony at the Marae with 5 artists, Tahitian certificate and Tifaifai ritual',
          '2 wedding cocktails and invitation to the grand Polynesian evening',
        ],
      },
      {
        name: 'TRADITION CEREMONY',
        tagline: 'A richer Tahitian ceremony with floral welcome, music and a larger troupe.',
        price: '120,000 XPF',
        note: 'about 1,005.61 EUR',
        highlights: [
          'Flower crowns, punch welcome and ceremony with 14 artists',
          'Royal procession, singers, dancers and lagoon views from the Marae',
          'Invitation to the grand Polynesian evening and photo / video options',
        ],
      },
      {
        name: 'LAGOON ARRIVAL',
        tagline: 'A spectacular canoe arrival and a grand ceremony staged on the village beach.',
        price: '160,000 XPF',
        note: 'about 1,340.82 EUR',
        highlights: [
          'Arrival by the lagoon aboard a double canoe escorted by 3 smaller canoes',
          'Tattoos, royal procession, champagne and a romantic canoe ride',
          'Invitation to the grand Polynesian evening and many optional extras',
        ],
      },
      {
        name: 'PRESTIGE CEREMONY',
        tagline: 'An exceptional timeless celebration with a couple’s massage and private show.',
        price: '195,000 XPF',
        note: 'about 1,634.12 EUR',
        highlights: [
          'Lagoon arrival, 24 artists, royal procession and champagne',
          'Private traditional and fire show, romantic canoe cruise',
          'Couple massage in the bamboo fare and invitation to the grand Polynesian evening',
        ],
      },
    ] as Package[],
    romanceTitle: 'A ROMANTIC AND HIGHLY STAGED EXPERIENCE',
    romanceBody: [
      'Tiki Village weddings are not designed as ordinary services. They extend a powerful visual universe: lagoon arrival, tropical flowers, ceremonial fabrics, songs and percussion.',
      'The result is immersive, deeply Polynesian and built to leave a lasting impression. That blend of emotion and staging is what makes the source page so memorable.',
    ],
    finalTitle: 'READY TO WRITE THIS UNFORGETTABLE CHAPTER TOGETHER?',
    finalBody:
      'Tell us about your wedding plans and we will guide you toward the formula that best fits your ceremony in Moorea.',
    finalPrimary: 'CONTACT US',
    finalSecondary: 'VIEW SERVICES',
  },
  ja: {
    eyebrow: 'おふたりの結婚式は',
    title: 'ワスレラレナイ アイ',
    subtitle:
      'ラグーン沿いで叶えるタヒチアンセレモニー。感動、伝統、音楽、そして二人の大切な時間がひとつになります。',
    heroCta: 'お問い合わせ',
    introTitle: 'おふたりらしい物語になるセレモニー',
    introBody: [
      'すべての愛のかたちは特別だからこそ、結婚式にも特別な魔法が必要です。ティキ・ヴィレッジでは、感情、笑顔、そして長く心に残る思い出に満ちた式を形にします。',
      'ラグーン沿いのポリネシアの村を舞台に、伝統衣装、歌、タトゥー、カヌー、マッサージ、音楽によるお迎えが、時を超えた体験を演出します。',
    ],
    sectionTitle: 'ウェディング プラン',
    sectionBody:
      '静かで親密な儀式から華やかな演出まで、モーレアでの祝福にふさわしい複数のプランをご用意しています。',
    packageButton: 'お見積りはこちら',
    packages: [
      {
        name: 'インティメイト ウェディング',
        tagline: '優しく感動的なセレモニーで、親密に誓いを交わすプランです。',
        price: '70 000 CFP',
        note: '約 586.60 EUR',
        highlights: [
          '音楽でのお迎えと伝統衣装のフィッティング',
          '5名のアーティストによるマラエでの儀式、証書、ティファイファイ',
          'ウェディングカクテル2杯とポリネシアンナイトへのご招待',
        ],
      },
      {
        name: 'トラディション セレモニー',
        tagline: '花と音楽に包まれた、より華やかなタヒチアンセレモニーです。',
        price: '120 000 CFP',
        note: '約 1 005.61 EUR',
        highlights: [
          '花冠、パンチのお迎え、14名のアーティストによる儀式',
          'ロイヤルプロセッション、歌と踊り、マラエからのラグーンビュー',
          'ポリネシアンナイトご招待と写真・動画オプション',
        ],
      },
      {
        name: 'ラグーン アライバル',
        tagline: 'カヌーでの登場が印象的な、海辺の壮大なセレモニーです。',
        price: '160 000 CFP',
        note: '約 1 340.82 EUR',
        highlights: [
          'ダブルカヌーと3艘のカヌーによるラグーン到着',
          'タトゥー、ロイヤルプロセッション、シャンパン、ロマンチックな舟遊び',
          'ポリネシアンナイトご招待と多数の追加オプション',
        ],
      },
      {
        name: 'プレステージ セレモニー',
        tagline: '二人のマッサージとプライベートショーまで含む特別な祝福です。',
        price: '195 000 CFP',
        note: '約 1 634.12 EUR',
        highlights: [
          'ラグーン到着、24名のアーティスト、ロイヤルプロセッション、シャンパン',
          'プライベートの伝統舞踊とファイヤーショー、ロマンチッククルーズ',
          '二人のマッサージとポリネシアンナイトへのご招待',
        ],
      },
    ] as Package[],
    romanceTitle: 'ロマンチックで印象的な世界観',
    romanceBody: [
      'ティキ・ヴィレッジの結婚式は、単なるサービスではなく、ラグーン到着、南国の花、伝統布、歌、太鼓などが織りなす世界観そのものです。',
      '強い感情と美しい演出が一体となり、深くポリネシアらしい、記憶に残るひとときを生み出します。',
    ],
    finalTitle: 'ワスレラレナイ チャプターを一緒に始めませんか',
    finalBody:
      'ご希望をお聞かせいただければ、モーレアでのセレモニーに最適なプランをご案内します。',
    finalPrimary: 'お問い合わせ',
    finalSecondary: 'プランを見る',
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

export function MariagesPageContent({ locale, page }: Props) {
  const text = copy[(locale as keyof typeof copy) || 'fr'] ?? copy.fr
  const heroMedia = getHeroMedia(page)

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden">
        <style>{`
          .mariages-hero-wave {
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
              imgClassName="object-cover [object-position:center_35%]"
              videoClassName="h-full w-full object-cover [object-position:center_35%]"
            />
          ) : (
            <img
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-[center_35%]"
              src="/images/mariage.jpg"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,14,18,0.55)_0%,rgba(28,14,18,0.24)_48%,rgba(28,14,18,0.12)_100%)]" />
        </div>

        <div className="relative z-[1] mx-auto flex min-h-[68vh] w-full max-w-[1600px] items-end px-6 pb-24 pt-28 md:px-10 lg:min-h-[76vh] lg:pb-28 xl:px-16">
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
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#8cc63f] bg-[#8cc63f] px-8 py-3 font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#173118] no-underline transition hover:border-[#76ad2f] hover:bg-[#76ad2f]"
              label={text.heroCta}
              type="custom"
              url={`/${locale}/contact`}
            />
          </div>
        </div>

        <div
          aria-hidden
          className="mariages-hero-wave bottom-0 h-[58px] [transform:scaleY(-1)] md:h-[66px]"
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

      <section className="bg-[#f7f6f0] px-6 py-20 md:px-10 xl:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 max-w-[860px]">
            <img
              alt=""
              aria-hidden
              className="mb-6 w-[92px]"
              src="/images/bg-frise-horiz-v2-1280.svg"
            />
            <h2 className="mb-4 font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.08] text-[#033537]">
              {text.sectionTitle}
            </h2>
            <p className="font-[Dosis,sans-serif] text-[25px] leading-[1.6] text-[#818181]">
              {text.sectionBody}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {text.packages.map((item) => (
              <article
                className="flex h-full flex-col rounded-[28px] bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
                key={item.name}
              >
                <h3 className="mb-4 font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.05] text-[#033537]">
                  {item.name}
                </h3>
                <p className="mb-2 font-['Roboto_Condensed',sans-serif] text-[22px] font-normal uppercase tracking-[0.08em] text-[#c05b84]">
                  {item.price}
                </p>
                {item.note && (
                  <p className="mb-4 font-[Dosis,sans-serif] text-[20px] leading-[1.35] text-[#8f8f8f]">
                    {item.note}
                  </p>
                )}
                <p className="mb-6 font-[Dosis,sans-serif] text-[25px] leading-[1.55] text-[#818181]">
                  {item.tagline}
                </p>
                <ul className="space-y-3">
                  {item.highlights.map((highlight) => (
                    <li
                      className="border-t border-[#ece8da] pt-3 font-[Dosis,sans-serif] text-[25px] leading-[1.45] text-[#495338]"
                      key={highlight}
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <CMSLink
                    appearance="default"
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#8cc63f] bg-[#8cc63f] px-6 py-3 text-center font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#173118] no-underline transition hover:border-[#76ad2f] hover:bg-[#76ad2f]"
                    label={text.packageButton}
                    type="custom"
                    url={`/${locale}/contact`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[380px] overflow-hidden lg:min-h-[560px]">
          <img
            alt="Mariage polynésien au Tiki Village"
            className="h-full w-full object-cover"
            src="/images/mariage.jpg"
          />
        </div>
        <div className="flex min-h-[380px] items-center bg-[#495338] px-6 py-16 text-white md:px-10 lg:min-h-[560px] lg:px-16 xl:px-20">
          <div className="max-w-[720px]">
            <img
              alt=""
              aria-hidden
              className="mb-6 w-[84px]"
              src="/images/bg-frise-horiz-v2-1280.svg"
            />
            <h2 className="mb-8 max-w-[18ch] font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.08] text-white">
              {text.romanceTitle}
            </h2>
            <div className="prose max-w-none text-white/85">
              {text.romanceBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
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
          <h2 className="mx-auto mb-6 max-w-[22ch] font-[Dosis,sans-serif] text-[30px] font-normal uppercase leading-[1.08] text-white">
            {text.finalTitle}
          </h2>
          <p className="mx-auto mb-10 max-w-[760px] font-[Dosis,sans-serif] text-[25px] leading-[1.6] text-white/80">
            {text.finalBody}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CMSLink
              appearance="default"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#8cc63f] bg-[#8cc63f] px-8 py-3 font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#173118] no-underline transition hover:border-[#76ad2f] hover:bg-[#76ad2f]"
              label={text.finalPrimary}
              type="custom"
              url={`/${locale}/contact`}
            />
            <CMSLink
              appearance="default"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#f5c842] bg-[#f5c842] px-8 py-3 font-['Roboto_Condensed',sans-serif] text-[18px] font-normal uppercase tracking-[0.08em] text-[#1c244b] no-underline transition hover:border-[#fff1b8] hover:bg-[#fff1b8]"
              label={text.finalSecondary}
              type="custom"
              url={`/${locale}/prestations`}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
