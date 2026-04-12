import { getPayload } from 'payload'
import config from '@payload-config'

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

export const maxDuration = 60

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })

  try {
    // Récupérer la page home existante
    const homeResult = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
    })

    if (homeResult.docs.length === 0) {
      return Response.json({ error: "Page home non trouvée! Créez-la d'abord." }, { status: 404 })
    }

    const homePage = homeResult.docs[0]

    // Mettre à jour la page home avec les traductions EN et JA
    const updatedHome = await payload.update({
      collection: 'pages',
      id: homePage.id,
      data: {
        title: {
          ...(homePage.title as any),
          en: 'Home',
          ja: 'ホーム',
        },
        hero: {
          ...(homePage.hero as any),
          type: {
            ...(homePage.hero?.type as any),
            en: 'highImpact',
            ja: 'highImpact',
          },
          richText: {
            ...(homePage.hero?.richText as any),
            en: createHeroRichText('en'),
            ja: createHeroRichText('ja'),
          },
          links: {
            ...(homePage.hero?.links as any),
            en: createHeroLinks('en'),
            ja: createHeroLinks('ja'),
          },
        },
        meta: {
          ...(homePage.meta as any),
          title: {
            ...(homePage.meta?.title as any),
            en: 'Tiki Village',
            ja: 'ティキ ビレッジ',
          },
          description: {
            ...(homePage.meta?.description as any),
            en: 'Polynesian cultural center in Moorea, shows, weddings and cultural experiences.',
            ja: 'モーレアのポリネシア文化センター、ショー、ウェディング、文化体験。',
          },
        },
      },
    })

    console.log('✅ Page home mise à jour avec traductions EN et JA')

    // Récupérer et mettre à jour la page contact
    const contactResult = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'contact' } },
    })

    if (contactResult.docs.length > 0) {
      const contactPage = contactResult.docs[0]

      await payload.update({
        collection: 'pages',
        id: contactPage.id,
        data: {
          title: {
            ...(contactPage.title as any),
            en: 'Contact',
            ja: 'お問い合わせ',
          },
          hero: {
            type: {
              ...(contactPage.hero?.type as any),
              en: 'none',
              ja: 'none',
            },
          },
        },
      })

      console.log('✅ Page contact mise à jour avec traductions EN et JA')
    }

    return Response.json({
      success: true,
      message: 'Traductions EN et JA ajoutées avec succès!',
      home: {
        fr: updatedHome.title?.fr,
        en: updatedHome.title?.en,
        ja: updatedHome.title?.ja,
      },
    })
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    return Response.json(
      {
        error: "Erreur lors de l'ajout des traductions",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
