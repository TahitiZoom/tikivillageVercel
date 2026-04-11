import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { ProductReservationPageContent } from '@/components/ProductReservationPageContent'
import { commerceProductsBySlug } from '@/data/commerceProducts'
import { generateMeta } from '@/utilities/generateMeta'
import { resolveLocalizedValue } from '@/utilities/localizedValue'
import { queryProductBySlug } from '@/utilities/queryProducts'

type Props = {
  params: Promise<{
    locale: 'fr' | 'en' | 'ja'
    slug: string
  }>
}

export default async function ReservationProductPage({ params }: Props) {
  const { isEnabled: draft } = await draftMode()
  const { locale, slug } = await params
  const product = await queryProductBySlug({ slug, locale, draft })

  if (!product) {
    notFound()
  }

  return <ProductReservationPageContent locale={locale} product={product} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await queryProductBySlug({ slug, locale, draft: false })
  const fallback = commerceProductsBySlug[slug]
  const title = product ? resolveLocalizedValue(product.name, locale, fallback?.name[locale] ?? 'Réservation') : 'Réservation'
  const description = product
    ? resolveLocalizedValue(
        product.shortDescription,
        locale,
        fallback?.shortDescription[locale] ?? undefined,
      )
    : undefined

  return generateMeta({
    doc: {
      slug: `/${locale}/reservations/${slug}`,
      meta: {
        title,
        description,
      },
    },
  })
}
