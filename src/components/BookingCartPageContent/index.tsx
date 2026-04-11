import Link from 'next/link'

import { removeBookingFromCart } from '@/app/(frontend)/actions/bookingCart'
import { commerceProductsBySlug, formatXPF, type SupportedLocale } from '@/data/commerceProducts'
import type { BookingCartItem } from '@/utilities/bookingCart'
import type { Product } from '@/payload-types'
import { calculateCartItemTotal } from '@/utilities/bookingCart'
import { resolveLocalizedValue } from '@/utilities/localizedValue'

type Props = {
  locale: SupportedLocale
  cart: BookingCartItem | null
  product: Product | null
}

const copy = {
  fr: {
    title: 'PANIER',
    empty: 'Votre panier est vide pour le moment.',
    continue: 'VOIR LES PRESTATIONS',
    checkout: 'COMMANDER',
    remove: 'RETIRER',
    date: 'Date de réservation',
    adults: 'Adulte',
    children: 'Enfant -12 ans',
    transferAdults: 'Transfert adulte',
    transferChildren: 'Transfert enfant',
    subtotal: 'Sous-total',
    total: 'Total',
  },
  en: {
    title: 'CART',
    empty: 'Your cart is currently empty.',
    continue: 'VIEW SERVICES',
    checkout: 'CHECKOUT',
    remove: 'REMOVE',
    date: 'Booking date',
    adults: 'Adult',
    children: 'Child under 12',
    transferAdults: 'Adult transfer',
    transferChildren: 'Child transfer',
    subtotal: 'Subtotal',
    total: 'Total',
  },
  ja: {
    title: 'カート',
    empty: '現在カートに商品はありません。',
    continue: 'サービスを見る',
    checkout: '注文へ進む',
    remove: '削除',
    date: '予約日',
    adults: '大人',
    children: '子ども',
    transferAdults: '大人送迎',
    transferChildren: '子ども送迎',
    subtotal: '小計',
    total: '合計',
  },
} as const

export function BookingCartPageContent({ locale, cart, product }: Props) {
  const text = copy[locale]

  if (!cart || !product) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-24">
        <h1 className="font-[Dosis,sans-serif] text-[42px] font-normal uppercase text-[#0b4b54]">
          {text.title}
        </h1>
        <p className="mt-6 text-[25px] leading-[1.7] text-[#7a7a7a]">{text.empty}</p>
        <Link
          className="mt-8 inline-flex bg-[#033537] px-8 py-4 font-[Roboto_Condensed,sans-serif] text-[20px] uppercase text-white no-underline"
          href={`/${locale}/reservations`}
        >
          {text.continue}
        </Link>
      </main>
    )
  }

  const totals = calculateCartItemTotal(product, cart)
  const image = commerceProductsBySlug[product.slug]?.image ?? '/images/village.jpg'
  const productName = resolveLocalizedValue(
    product.name,
    locale,
    commerceProductsBySlug[product.slug]?.name[locale] ?? product.slug,
  )

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-20">
      <h1 className="font-[Dosis,sans-serif] text-[42px] font-normal uppercase text-[#0b4b54]">
        {text.title}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="border border-[#e5e5e5] bg-white p-8">
          <div className="grid gap-8 md:grid-cols-[260px_minmax(0,1fr)]">
            <img src={image} alt={productName} className="h-[260px] w-full object-cover" />
            <div>
              <h2 className="font-[Dosis,sans-serif] text-[34px] font-normal uppercase text-[#0b4b54]">
                {productName}
              </h2>
              <p className="mt-3 text-[24px] text-[#7a7a7a]">{text.date}: {cart.date}</p>
              <ul className="mt-6 space-y-2 text-[23px] leading-[1.6] text-[#5f5f5f]">
                <li>{text.adults}: {cart.adults}</li>
                {product.pricing?.hasPersonTypes ? <li>{text.children}: {cart.children}</li> : null}
                {cart.transferAdults > 0 ? <li>{text.transferAdults}: {cart.transferAdults}</li> : null}
                {cart.transferChildren > 0 ? <li>{text.transferChildren}: {cart.transferChildren}</li> : null}
              </ul>

              <form action={removeBookingFromCart} className="mt-8">
                <input type="hidden" name="locale" value={locale} />
                <button
                  className="inline-flex border border-[#cb4b7d] px-5 py-3 font-[Roboto_Condensed,sans-serif] text-[18px] uppercase text-[#cb4b7d] transition hover:bg-[#cb4b7d] hover:text-white"
                  type="submit"
                >
                  {text.remove}
                </button>
              </form>
            </div>
          </div>
        </section>

        <aside className="border border-[#d8d8d8] bg-[#fafafa] p-8">
          <div className="flex items-center justify-between text-[24px] text-[#3d3d3d]">
            <span>{text.subtotal}</span>
            <strong>{formatXPF(totals.total)}</strong>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#d8d8d8] pt-4 text-[28px] text-[#0b4b54]">
            <span>{text.total}</span>
            <strong>{formatXPF(totals.total)}</strong>
          </div>

          <Link
            className="mt-8 flex w-full justify-center bg-[#6f7785] px-6 py-4 font-[Roboto_Condensed,sans-serif] text-[24px] uppercase text-white no-underline transition hover:bg-[#59606b]"
            href={`/${locale}/commande`}
          >
            {text.checkout}
          </Link>
        </aside>
      </div>
    </main>
  )
}
