import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { ProductReservationPageContent } from '@/components/ProductReservationPageContent'
import { generateMeta } from '@/utilities/generateMeta'
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

  return generateMeta({
    doc: {
      slug: `/${locale}/reservations/${slug}`,
      meta: {
        title: product?.name ? String(product.name) : 'Réservation',
        description: product?.shortDescription ? String(product.shortDescription) : undefined,
      },
    },
  })
}
