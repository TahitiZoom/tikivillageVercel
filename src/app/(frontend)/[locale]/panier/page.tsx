import { BookingCartPageContent } from '@/components/BookingCartPageContent'
import { readBookingCart } from '@/utilities/bookingCart'
import { queryProductBySlug } from '@/utilities/queryProducts'

type Props = {
  params: Promise<{
    locale: 'fr' | 'en' | 'ja'
  }>
}

export default async function PanierPage({ params }: Props) {
  const { locale } = await params
  const cart = await readBookingCart()
  const product = cart ? await queryProductBySlug({ slug: cart.slug, locale }) : null

  return <BookingCartPageContent cart={cart} locale={locale} product={product} />
}
