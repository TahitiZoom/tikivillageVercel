import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

const createLocaleHero = (locale: 'fr' | 'en' | 'ja', heroImage: Media) => {
  const textByLocale = {
    fr: {
      heading: 'Tiki Village',
      link1Text: 'Découvrir Tiki Village',
      link1Url: '/fr',
      description: ' au cœur de la culture polynésienne à Moorea. ',
      link2Text: 'Découvrir nos expériences',
      link2Url: '/fr/centre-culturel',
    },
    en: {
      heading: 'Tiki Village',
      link1Text: 'Discover Tiki Village',
      link1Url: '/en',
      description: ' at the heart of Polynesian culture in Moorea. ',
      link2Text: 'Discover our experiences',
      link2Url: '/en/centre-culturel',
    },
    ja: {
      heading: 'ティキ ビレッジ',
      link1Text: 'ティキビレッジを発見',
      link1Url: '/ja',
      description: ' モーレア ポリネシア文化の中心地で。',
      link2Text: ' あなたの経験を発見する',
      link2Url: '/ja/centre-culturel',
    },
  }

  const text = textByLocale[locale]

  return {
    type: 'highImpact',
    links: [
      {
        link: {
          type: 'custom' as const,
          appearance: 'default' as const,
          label:
            locale === 'fr' ? 'Tous les articles' : locale === 'en' ? 'All posts' : 'すべての記事',
          url: `/${locale}/posts`,
        },
      },
      {
        link: {
          type: 'custom' as const,
          appearance: 'outline' as const,
          label: locale === 'ja' ? 'お問い合わせ' : 'Contact',
          url: `/${locale}/contact`,
        },
      },
    ],
    media: heroImage.id,
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: text.heading,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'link',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: text.link1Text,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                fields: {
                  linkType: 'custom',
                  newTab: false,
                  url: text.link1Url,
                },
                format: '',
                indent: 0,
                version: 3,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: text.description,
                version: 1,
              },
              {
                type: 'link',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: text.link2Text,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                fields: {
                  linkType: 'custom',
                  newTab: true,
                  url: text.link2Url,
                },
                format: '',
                indent: 0,
                version: 3,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: '.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  }
}

// Create simplified localized home page with structured translations
export const homeLocalized: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    title: {
      fr: 'Accueil',
      en: 'Home',
      ja: 'ホーム',
    },
    // Pour les groupes localisés, chaque champ DANS le groupe doit être localisé
    hero: {
      type: {
        fr: 'highImpact',
        en: 'highImpact',
        ja: 'highImpact',
      },
      media: {
        fr: heroImage.id,
        en: heroImage.id,
        ja: heroImage.id,
      },
      richText: {
        fr: createLocaleHero('fr', heroImage).richText,
        en: createLocaleHero('en', heroImage).richText,
        ja: createLocaleHero('ja', heroImage).richText,
      },
      links: {
        fr: createLocaleHero('fr', heroImage).links,
        en: createLocaleHero('en', heroImage).links,
        ja: createLocaleHero('ja', heroImage).links,
      },
    },
    layout: {
      fr: [],
      en: [],
      ja: [],
    },
    meta: {
      description: {
        fr: 'Centre culturel polynésien à Moorea, spectacles, mariages et expériences culturelles.',
        en: 'Polynesian cultural center in Moorea, shows, weddings and cultural experiences.',
        ja: 'モーレアのポリネシア文化センター、ショー、ウェディング、文化体験。',
      },
      title: {
        fr: 'Tiki Village',
        en: 'Tiki Village',
        ja: 'ティキ ビレッジ',
      },
    },
  } as any
}
