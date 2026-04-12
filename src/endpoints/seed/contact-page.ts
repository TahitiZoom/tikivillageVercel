import type { Form } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ContactArgs = {
  contactForm: Form
}

const createContactIntro = (locale: 'fr' | 'en' | 'ja') => {
  const textByLocale = {
    fr: 'Formulaire de contact:',
    en: 'Contact form:',
    ja: 'お問い合わせフォーム:',
  }

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
              text: textByLocale[locale],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h3',
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

export const contactLocalized: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
}) => {
  return {
    slug: 'contact',
    _status: 'published',
    title: {
      fr: 'Contact',
      en: 'Contact',
      ja: 'お問い合わせ',
    },
    hero: {
      fr: { type: 'none' },
      en: { type: 'none' },
      ja: { type: 'none' },
    },
    layout: {
      fr: [
        {
          blockType: 'formBlock',
          enableIntro: true,
          form: contactForm,
          introContent: createContactIntro('fr'),
        },
      ],
      en: [
        {
          blockType: 'formBlock',
          enableIntro: true,
          form: contactForm,
          introContent: createContactIntro('en'),
        },
      ],
      ja: [
        {
          blockType: 'formBlock',
          enableIntro: true,
          form: contactForm,
          introContent: createContactIntro('ja'),
        },
      ],
    },
  } as any
}
