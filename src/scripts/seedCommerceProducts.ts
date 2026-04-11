import { getPayload } from 'payload'

import config from '@payload-config'
import { commerceProductsSeed } from '@/data/commerceProducts'

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
    const frData: any = {
      ...baseData,
      ...buildLocalizedPayloadData(seed, 'fr', true),
    }

    let id: number

    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        data: baseData,
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
      await payload.update({
        collection: 'products',
        id,
        locale,
        data: buildLocalizedPayloadData(seed, locale, locale === 'fr'),
      })
    }
  }
}

await main()
