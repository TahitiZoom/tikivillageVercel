import { cookies } from 'next/headers'

import type { Product } from '@/payload-types'

const BOOKING_CART_COOKIE = 'booking-cart'
const BOOKING_CART_ID_COOKIE = 'booking-cart-id'

export type BookingCartItem = {
  slug: string
  locale: 'fr' | 'en' | 'ja'
  date: string
  adults: number
  children: number
  transferAdults: number
  transferChildren: number
}

export const calculateCartItemTotal = (product: Product, item: BookingCartItem) => {
  const priceAdult = product.pricing?.priceAdult ?? 0
  const priceChild = product.pricing?.priceChild ?? 0
  const transferPriceAdult = product.transferOptions?.transferPriceAdult ?? 0
  const transferPriceChild = product.transferOptions?.transferPriceChild ?? 0

  const subtotalPersons =
    item.adults * priceAdult + item.children * (product.pricing?.hasPersonTypes ? priceChild : priceAdult)

  const subtotalTransfer =
    item.transferAdults * transferPriceAdult + item.transferChildren * transferPriceChild

  return {
    subtotalPersons,
    subtotalTransfer,
    total: subtotalPersons + subtotalTransfer,
  }
}

export const readBookingCart = async (): Promise<BookingCartItem | null> => {
  const cookieStore = await cookies()
  const value = cookieStore.get(BOOKING_CART_COOKIE)?.value

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as BookingCartItem
  } catch {
    return null
  }
}

export const writeBookingCart = async (item: BookingCartItem) => {
  const cookieStore = await cookies()

  if (!cookieStore.get(BOOKING_CART_ID_COOKIE)?.value) {
    cookieStore.set(BOOKING_CART_ID_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  cookieStore.set(BOOKING_CART_COOKIE, JSON.stringify(item), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export const clearBookingCart = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(BOOKING_CART_COOKIE)
}
