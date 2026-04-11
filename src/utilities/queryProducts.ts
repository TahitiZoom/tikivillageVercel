import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { Product } from '@/payload-types'
import { commerceProductsBySlug } from '@/data/commerceProducts'

type QueryProductsArgs = {
  locale: 'fr' | 'en' | 'ja'
  draft?: boolean
}

const getProducts = unstable_cache(
  async (locale: 'fr' | 'en' | 'ja', draft = false) => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'products',
      depth: 0,
      draft,
      limit: 100,
      locale,
      overrideAccess: false,
      pagination: false,
      sort: 'sortOrder',
      where: {
        status: {
          equals: 'active',
        },
      },
    })

    return result.docs as Product[]
  },
  ['products-catalog'],
  {
    tags: ['products'],
  },
)

const getProduct = unstable_cache(
  async (slug: string, locale: 'fr' | 'en' | 'ja', draft = false) => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'products',
      depth: 0,
      draft,
      limit: 1,
      locale,
      overrideAccess: false,
      pagination: false,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            status: {
              equals: 'active',
            },
          },
        ],
      },
    })

    return (result.docs?.[0] as Product | undefined) ?? null
  },
  ['product-detail'],
  {
    tags: ['products'],
  },
)

export const queryProducts = async ({ locale, draft = false }: QueryProductsArgs) => {
  return await getProducts(locale, draft)
}

export const queryProductBySlug = async ({
  slug,
  locale,
  draft = false,
}: QueryProductsArgs & { slug: string }) => {
  const product = await getProduct(slug, locale, draft)

  if (product) {
    return product
  }

  const fallback = commerceProductsBySlug[slug]

  if (!fallback) {
    return null
  }

  return {
    id: 0,
    slug: fallback.slug,
    type: fallback.type,
    category: fallback.category,
    status: 'active',
    sortOrder: fallback.sortOrder,
    name: fallback.name[locale],
    shortDescription: fallback.shortDescription[locale],
    pricing: {
      currency: fallback.pricing.currency,
      hasPersonTypes: fallback.pricing.hasPersonTypes,
      priceAdult: fallback.pricing.priceAdult,
      priceChild: fallback.pricing.priceChild,
      displayPrice: fallback.pricing.displayPrice,
    },
    transferOptions: fallback.transferOptions,
    booking: {
      isBookable: fallback.booking.isBookable,
      minPersons: fallback.booking.minPersons,
      maxPersons: fallback.booking.maxPersons,
      minAdvanceDays: fallback.booking.minAdvanceDays,
      maxAdvanceMonths: fallback.booking.maxAdvanceMonths,
      availableDays: fallback.booking.availableDays,
      timeSlot: fallback.booking.timeSlot[locale],
    },
    cancellation: {
      fee24h: 100,
      fee7days: 30,
      feeOver8days: 0,
    },
    weddingOptions: fallback.weddingOptions?.map((option) => ({
      name: option.name[locale],
      price: option.price,
    })),
    featuredImage: null,
    gallery: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  } as unknown as Product
}
