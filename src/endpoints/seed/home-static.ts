import type { RequiredDataFromCollectionSlug } from 'payload'

// Contenu de hero par locale
const heroRichTextByLocale = {
  fr: {
    heading: 'Tiki Village',
    link1: { text: 'Découvrir Tiki Village', url: '/fr' },
    description: ' au cœur de la culture polynésienne à Moorea.',
  },
  en: {
    heading: 'Tiki Village',
    link1: { text: 'Discover Tiki Village', url: '/en' },
    description: ' at the heart of Polynesian culture in Moorea.',
  },
  ja: {
    heading: 'ティキ ビレッジ',
    link1: { text: 'ティキビレッジを発見', url: '/ja' },
    description: ' モーレア ポリネシア文化の中心地で。',
  },
}

const createHeroRichText = (locale: 'fr' | 'en' | 'ja'): any => {
  const content = heroRichTextByLocale[locale]
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
              text: content.heading,
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
                  text: content.link1.text,
                  version: 1,
                },
              ],
              direction: 'ltr',
              fields: {
                linkType: 'custom',
                newTab: false,
                url: content.link1.url,
              },
              format: '',
              indent: 0,
              version: 2,
            },
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: content.description,
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

// Métadonnées par locale
const metaByLocale = {
  fr: {
    title: 'Tiki Village',
    description:
      'Centre culturel polynésien à Moorea, spectacles, mariages et expériences culturelles.',
  },
  en: {
    title: 'Tiki Village',
    description: 'Polynesian cultural center in Moorea, shows, weddings and cultural experiences.',
  },
  ja: {
    title: 'ティキ ビレッジ',
    description: 'モーレアのポリネシア文化センター、ショー、ウェディング、文化体験。',
  },
}

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: createHeroRichText('fr') as any,
  },
  meta: metaByLocale.fr as any,
  title: 'Home',
  layout: [],
}

// Fallbacks pour EN et JA (utile si queryPageBySlug retourne null)
export const homeStaticEN: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: createHeroRichText('en') as any,
  },
  meta: metaByLocale.en as any,
  title: 'Home',
  layout: [],
}

export const homeStaticJA: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: createHeroRichText('ja') as any,
  },
  meta: metaByLocale.ja as any,
  title: 'Home',
  layout: [],
}
