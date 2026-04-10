import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const queryPageBySlug = cache(
  async ({ slug, locale, draft }: { slug: string; locale: string; draft: boolean }) => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      locale: locale as 'fr' | 'en' | 'ja',
      where: { slug: { equals: slug } },
    })

    return result.docs?.[0] || null
  },
)
