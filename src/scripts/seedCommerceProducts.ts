import { getPayload } from 'payload'

import config from '@payload-config'
import { commerceProductsSeed } from '@/data/commerceProducts'

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

    const data: any = {
      slug: seed.slug,
      type: seed.type,
      category: seed.category,
      status: 'active' as const,
      sortOrder: seed.sortOrder,
      name: seed.name,
      shortDescription: seed.shortDescription,
      pricing: seed.pricing,
      transferOptions: seed.transferOptions,
      booking: { ...seed.booking, timeSlot: seed.booking.timeSlot },
      cancellation: {
        fee24h: 100,
        fee7days: 30,
        feeOver8days: 0,
      },
      weddingOptions: seed.weddingOptions?.map((option) => ({
        name: option.name,
        price: option.price,
      })),
      externalBookingUrl: seed.externalBookingUrl,
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        data,
      })
      console.log(`updated: ${seed.slug}`)
    } else {
      await payload.create({
        collection: 'products',
        data,
      })
      console.log(`created: ${seed.slug}`)
    }
  }
}

await main()
