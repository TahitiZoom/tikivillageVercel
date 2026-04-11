'use server'

import configPromise from '@payload-config'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { clearBookingCart, type BookingCartItem, readBookingCart, writeBookingCart } from '@/utilities/bookingCart'
import { resolveLocalizedValue } from '@/utilities/localizedValue'
import { queryProductBySlug } from '@/utilities/queryProducts'

const parsePositiveInt = (value: FormDataEntryValue | null, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback
}

const formatNowToken = () => {
  const now = new Date()
  return `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}${String(now.getUTCHours()).padStart(2, '0')}${String(now.getUTCMinutes()).padStart(2, '0')}`
}

export async function addBookingToCart(formData: FormData) {
  const locale = (formData.get('locale') as 'fr' | 'en' | 'ja') || 'fr'
  const slug = String(formData.get('slug') || '')
  const date = String(formData.get('date') || '')
  const adults = parsePositiveInt(formData.get('adults'), 1)
  const children = parsePositiveInt(formData.get('children'), 0)
  const transferAdults = parsePositiveInt(formData.get('transferAdults'), 0)
  const transferChildren = parsePositiveInt(formData.get('transferChildren'), 0)

  const product = await queryProductBySlug({ slug, locale })

  if (!product || !product.booking?.isBookable) {
    redirect(`/${locale}/reservations`)
  }

  const item: BookingCartItem = {
    slug,
    locale,
    date,
    adults,
    children,
    transferAdults,
    transferChildren,
  }

  await writeBookingCart(item)
  revalidateTag('cart', 'max')
  revalidatePath(`/${locale}/panier`)
  redirect(`/${locale}/panier`)
}

export async function removeBookingFromCart(formData: FormData) {
  const locale = (formData.get('locale') as 'fr' | 'en' | 'ja') || 'fr'
  await clearBookingCart()
  revalidateTag('cart', 'max')
  revalidatePath(`/${locale}/panier`)
  redirect(`/${locale}/panier`)
}

export async function submitCheckout(formData: FormData) {
  const locale = (formData.get('locale') as 'fr' | 'en' | 'ja') || 'fr'
  const cart = await readBookingCart()

  if (!cart) {
    redirect(`/${locale}/panier`)
  }

  const product = await queryProductBySlug({ slug: cart.slug, locale })

  if (!product) {
    await clearBookingCart()
    redirect(`/${locale}/panier`)
  }

  const payload = await getPayload({ config: configPromise })
  const totals = await import('@/utilities/bookingCart').then(({ calculateCartItemTotal }) =>
    calculateCartItemTotal(product, cart),
  )

  const bookingReference = `TV-${formatNowToken()}`
  const orderNumber = `CMD-${formatNowToken()}`
  const firstName = String(formData.get('firstName') || '').trim()
  const lastName = String(formData.get('lastName') || '').trim()
  const email = String(formData.get('email') || '').trim()

  if (!firstName || !lastName || !email || !cart.date) {
    redirect(`/${locale}/commande`)
  }

  const booking = await payload.create({
    collection: 'bookings',
    data: {
      bookingReference,
      product: product.id,
      date: cart.date,
      participants: {
        adults: cart.adults,
        children: cart.children,
      },
      options: {
        transferAdults: cart.transferAdults,
        transferChildren: cart.transferChildren,
      },
      breakdown: {
        subtotalPersons: totals.subtotalPersons,
        subtotalTransfer: totals.subtotalTransfer,
        discount: 0,
        totalAmount: totals.total,
      },
      totalAmount: totals.total,
      status: 'pending',
      guestInfo: {
        firstName,
        lastName,
        email,
        phone: String(formData.get('phone') || ''),
        country: String(formData.get('country') || 'PF'),
      },
      customerNotes: String(formData.get('orderNotes') || ''),
    },
  })

  await payload.create({
    collection: 'orders',
    data: {
      orderNumber,
      booking: booking.id,
      billing: {
        firstName,
        lastName,
        email,
        phone: String(formData.get('phone') || ''),
        company: String(formData.get('company') || ''),
        address1: String(formData.get('address1') || ''),
        address2: String(formData.get('address2') || ''),
        city: String(formData.get('city') || ''),
        region: String(formData.get('region') || ''),
        postalCode: String(formData.get('postalCode') || ''),
        country: String(formData.get('country') || 'PF'),
      },
      totalAmount: totals.total,
      lineItems: [
        {
          label: resolveLocalizedValue(product.name, locale, product.slug),
          quantity: 1,
          unitPrice: totals.total,
          subtotal: totals.total,
        },
      ],
      payment: {
        paymentStatus: 'pending',
      },
      orderNotes: String(formData.get('orderNotes') || ''),
    },
  })

  await clearBookingCart()
  revalidateTag('cart', 'max')
  redirect(`/${locale}/commande/confirmation?booking=${bookingReference}`)
}
