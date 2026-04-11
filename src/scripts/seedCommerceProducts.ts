import { getPayload } from 'payload'

import config from '@payload-config'
import { commerceProductsSeed } from '@/data/commerceProducts'

const getFilenameFromPath = (value: string) => value.split('/').pop() || value

const buildBasePayloadData = (seed: (typeof commerceProductsSeed)[number]) => {
  return {
    slug: seed.slug,
    type: seed.type,
    category: seed.category,
    status: 'active' as const,
    sortOrder: seed.sortOrder,
    pricing: seed.pricing,
    transferOptions: seed.transferOptions,
    cancellation: {
      fee24h: 100,
      fee7days: 30,
      feeOver8days: 0,
    },
    externalBookingUrl: seed.externalBookingUrl,
  }
}

const buildLocalizedPayloadData = (
  seed: (typeof commerceProductsSeed)[number],
  locale: 'fr' | 'en' | 'ja',
  includeWeddingOptions = false,
) => {
  return {
    name: seed.name[locale],
    shortDescription: seed.shortDescription[locale],
    booking: {
      ...seed.booking,
      timeSlot: seed.booking.timeSlot[locale],
    },
    ...(includeWeddingOptions
      ? {
          weddingOptions: seed.weddingOptions?.map((option) => ({
            name: option.name[locale],
            price: option.price,
          })),
        }
      : {}),
  }
}

const main = async () => {
  const payload = await getPayload({ config })
  const mediaIndex = new Map<string, number>()
  const mediaResult = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 200,
    overrideAccess: false,
    pagination: false,
  })

  for (const media of mediaResult.docs) {
    if (typeof media.filename === 'string') {
      mediaIndex.set(media.filename, media.id)
    }
  }

  for (const seed of commerceProductsSeed) {
    const existing = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      where: {
        slug: {
          equals: seed.slug,
        },
      },
    })

    const baseData: any = buildBasePayloadData(seed)
    const featuredImageID = mediaIndex.get(getFilenameFromPath(seed.image))
    const gallery = seed.gallery
      .map((item) => mediaIndex.get(getFilenameFromPath(item)))
      .filter((item): item is number => typeof item === 'number')
      .map((image) => ({ image }))
    const frData: any = {
      ...baseData,
      ...buildLocalizedPayloadData(seed, 'fr', true),
      ...(featuredImageID ? { featuredImage: featuredImageID } : {}),
      ...(gallery.length ? { gallery } : {}),
    }

    let id: number

    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        locale: 'fr',
        data: frData,
      })
      id = updated.id
      console.log(`updated: ${seed.slug}`)
    } else {
      const created = await payload.create({
        collection: 'products',
        locale: 'fr',
        data: frData,
      })
      id = created.id
      console.log(`created: ${seed.slug}`)
    }

    for (const locale of ['fr', 'en', 'ja'] as const) {
      try {
        await payload.update({
          collection: 'products',
          id,
          locale,
          data: buildLocalizedPayloadData(seed, locale, locale === 'fr'),
        })
      } catch (error) {
        if (seed.type === 'mariage' && locale !== 'fr') {
          console.warn(`skipped localized wedding options for ${seed.slug} (${locale})`)
          continue
        }

        throw error
      }
    }
  }
}

await main()
