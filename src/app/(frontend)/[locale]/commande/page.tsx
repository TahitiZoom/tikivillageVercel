import { redirect } from 'next/navigation'

import { CheckoutPageContent } from '@/components/CheckoutPageContent'
import { readBookingCart } from '@/utilities/bookingCart'
import { queryProductBySlug } from '@/utilities/queryProducts'

type Props = {
  params: Promise<{
    locale: 'fr' | 'en' | 'ja'
  }>
}

export default async function CommandePage({ params }: Props) {
  const { locale } = await params
  const cart = await readBookingCart()

  if (!cart) {
    redirect(`/${locale}/panier`)
  }

  const product = await queryProductBySlug({ slug: cart.slug, locale })

  if (!product) {
    redirect(`/${locale}/panier`)
  }

  return <CheckoutPageContent cart={cart} locale={locale} product={product} />
}
