import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

// Créer le contenu richText pour chaque locale
const createHeroRichText = (locale: 'fr' | 'en' | 'ja') => {
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
  }
}

// Créer les liens pour chaque locale
const createHeroLinks = (locale: 'fr' | 'en' | 'ja') => {
  const linksByLocale = {
    fr: [
      {
        link: {
          type: 'custom' as const,
          appearance: 'default' as const,
          label: 'Tous les articles',
          url: '/fr/posts',
        },
      },
      {
        link: {
          type: 'custom' as const,
          appearance: 'outline' as const,
          label: 'Contact',
          url: '/fr/contact',
        },
      },
    ],
    en: [
      {
        link: {
          type: 'custom' as const,
          appearance: 'default' as const,
          label: 'All posts',
          url: '/en/posts',
        },
      },
      {
        link: {
          type: 'custom' as const,
          appearance: 'outline' as const,
          label: 'Contact',
          url: '/en/contact',
        },
      },
    ],
    ja: [
      {
        link: {
          type: 'custom' as const,
          appearance: 'default' as const,
          label: 'すべての記事',
          url: '/ja/posts',
        },
      },
      {
        link: {
          type: 'custom' as const,
          appearance: 'outline' as const,
          label: 'お問い合わせ',
          url: '/ja/contact',
        },
      },
    ],
  }

  return linksByLocale[locale]
}

export const homeWithLocales: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
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
    // Groupe localisé: chaque CHAMP doit avoir FR/EN/JA
    hero: {
      type: {
        fr: 'highImpact',
        en: 'highImpact',
        ja: 'highImpact',
      },
      richText: {
        fr: createHeroRichText('fr'),
        en: createHeroRichText('en'),
        ja: createHeroRichText('ja'),
      },
      links: {
        fr: createHeroLinks('fr'),
        en: createHeroLinks('en'),
        ja: createHeroLinks('ja'),
      },
      media: heroImage.id, // pas localisé
    },
    layout: {
      fr: [],
      en: [],
      ja: [],
    },
    meta: {
      title: {
        fr: 'Tiki Village',
        en: 'Tiki Village',
        ja: 'ティキ ビレッジ',
      },
      description: {
        fr: 'Centre culturel polynésien à Moorea, spectacles, mariages et expériences culturelles.',
        en: 'Polynesian cultural center in Moorea, shows, weddings and cultural experiences.',
        ja: 'モーレアのポリネシア文化センター、ショー、ウェディング、文化体験。',
      },
    },
  } as any
}
