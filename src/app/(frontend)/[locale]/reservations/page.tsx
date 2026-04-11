import type { Metadata } from 'next'
import { draftMode } from 'next/headers'

import { ReservationsPageContent } from '@/components/ReservationsPageContent'
import { generateMeta } from '@/utilities/generateMeta'
import { queryProducts } from '@/utilities/queryProducts'

type Props = {
  params: Promise<{
    locale: 'fr' | 'en' | 'ja'
  }>
}

export default async function ReservationsPage({ params }: Props) {
  const { isEnabled: draft } = await draftMode()
  const { locale } = await params
  const products = await queryProducts({ locale, draft })

  return <ReservationsPageContent locale={locale} products={products} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  return generateMeta({
    doc: {
      slug: `/${locale}/reservations`,
      meta: {
        title: 'Réservations',
        description: 'Catalogue des prestations et réservations Tiki Village',
      },
    },
  })
}
