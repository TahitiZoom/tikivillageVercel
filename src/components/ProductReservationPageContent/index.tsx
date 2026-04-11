import Link from 'next/link'

import { addBookingToCart } from '@/app/(frontend)/actions/bookingCart'
import { commerceProductsBySlug, formatXPF, type SupportedLocale } from '@/data/commerceProducts'
import type { Product } from '@/payload-types'

type Props = {
  locale: SupportedLocale
  product: Product
}

const copy = {
  fr: {
    breadcrumbHome: 'ACCUEIL',
    breadcrumbCatalog: 'RESERVATIONS',
    adults: 'ADULTE',
    children: 'ENFANT - 12 ANS',
    bookingDate: 'DATE DE RESERVATION',
    transferAdults: 'TRANSFERT ALLER-RETOUR ADULTE',
    transferChildren: 'TRANSFERT ALLER-RETOUR ENFANT',
    reserve: 'RESERVER',
    quote: 'NOUS CONTACTER POUR UN DEVIS',
    priceFrom: 'DE',
    available: 'Disponibilités',
    contactHref: '/contact',
  },
  en: {
    breadcrumbHome: 'HOME',
    breadcrumbCatalog: 'BOOKINGS',
    adults: 'ADULT',
    children: 'CHILD - 12 YEARS',
    bookingDate: 'BOOKING DATE',
    transferAdults: 'ROUND TRIP TRANSFER ADULT',
    transferChildren: 'ROUND TRIP TRANSFER CHILD',
    reserve: 'BOOK NOW',
    quote: 'CONTACT US FOR A QUOTE',
    priceFrom: 'FROM',
    available: 'Availability',
    contactHref: '/contact',
  },
  ja: {
    breadcrumbHome: 'ホーム',
    breadcrumbCatalog: 'ご予約',
    adults: '大人',
    children: '子ども - 12歳',
    bookingDate: '予約日',
    transferAdults: '往復送迎 大人',
    transferChildren: '往復送迎 子ども',
    reserve: '予約する',
    quote: 'お見積りはこちら',
    priceFrom: '料金',
    available: '開催日',
    contactHref: '/contact',
  },
} as const

const availableDaysLabels: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  },
  en: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
  ja: {
    monday: '月曜日',
    tuesday: '火曜日',
    wednesday: '水曜日',
    thursday: '木曜日',
    friday: '金曜日',
    saturday: '土曜日',
    sunday: '日曜日',
  },
}

export function ProductReservationPageContent({ locale, product }: Props) {
  const source = commerceProductsBySlug[product.slug]
  const text = copy[locale]
  const price = product.pricing?.displayPrice ?? product.pricing?.priceAdult ?? 0
  const paragraphs = source?.descriptionParagraphs[locale] ?? []
  const highlights = source?.highlights[locale] ?? []
  const tags = source?.tags[locale] ?? []
  const gallery = source?.gallery?.length ? source.gallery : ['/images/village.jpg']
  const availableDays = product.booking?.availableDays ?? []
  const hasTransfer = product.transferOptions?.hasTransfer

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-12">
      <div className="mb-12 font-[Roboto_Condensed,sans-serif] text-[18px] uppercase text-[#8d8d8d]">
        <Link href={`/${locale}`}>{text.breadcrumbHome}</Link>
        <span> / </span>
        <Link href={`/${locale}/reservations`}>{text.breadcrumbCatalog}</Link>
        <span> / </span>
        <span>{product.name}</span>
      </div>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <section>
          <div className="overflow-hidden bg-[#f2f5f7]">
            <img src={gallery[0]} alt={String(product.name)} className="h-[470px] w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((image) => (
              <div key={image} className="overflow-hidden bg-[#f2f5f7]">
                <img src={image} alt="" className="h-[120px] w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="font-[Roboto_Condensed,sans-serif] text-[18px] uppercase tracking-[0.04em] text-[#1f1f1f]">
              UGS {product.slug.toUpperCase()}
            </div>
            <div className="mt-2 font-[Roboto_Condensed,sans-serif] text-[18px] uppercase tracking-[0.04em] text-[#1f1f1f]">
              CATEGORIE <span className="text-[#e04b86]">{product.category}</span>
            </div>
            <div className="mt-2 font-[Roboto_Condensed,sans-serif] text-[18px] uppercase tracking-[0.04em] text-[#1f1f1f]">
              ETIQUETTES{' '}
              <span className="text-[#e04b86]">{tags.join(', ')}</span>
            </div>
          </div>
        </section>

        <section>
          <h1 className="font-[Dosis,sans-serif] text-[42px] font-normal uppercase tracking-[0.03em] text-[#0b4b54]">
            {product.name}
          </h1>
          <p className="mt-3 font-[Dosis,sans-serif] text-[30px] font-normal uppercase text-[#9a9300]">
            {text.priceFrom} : {formatXPF(price)}
          </p>

          <div className="mt-10 space-y-6 text-[25px] leading-[1.7] text-[#7a7a7a]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {highlights.length ? (
            <ul className="mt-10 space-y-3 text-[23px] leading-[1.6] text-[#4c4c4c]">
              {highlights.map((highlight) => (
                <li key={highlight}>• {highlight}</li>
              ))}
            </ul>
          ) : null}

          {product.booking?.isBookable ? (
            <form action={addBookingToCart} className="mt-12 border border-[#e5e5e5] p-8">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="slug" value={product.slug} />

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
                    {text.adults}
                  </span>
                  <select
                    className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
                    defaultValue="1"
                    name="adults"
                  >
                    {Array.from({ length: 10 }).map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
                    {text.children}
                  </span>
                  <select
                    className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
                    defaultValue="0"
                    name="children"
                  >
                    {Array.from({ length: 10 }).map((_, index) => (
                      <option key={index} value={index}>
                        {index}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-6 block">
                <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
                  {text.bookingDate}
                </span>
                <input
                  className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
                  min={new Date().toISOString().slice(0, 10)}
                  name="date"
                  required
                  type="date"
                />
              </label>

              {availableDays.length ? (
                <p className="mt-4 text-[20px] leading-[1.6] text-[#8a8a8a]">
                  {text.available}:{' '}
                  {availableDays
                    .map((day) => availableDaysLabels[locale][day] ?? day)
                    .join(', ')}
                </p>
              ) : null}

              {hasTransfer ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
                      {text.transferAdults} (+{formatXPF(product.transferOptions?.transferPriceAdult ?? 0)})
                    </span>
                    <select
                      className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
                      defaultValue="0"
                      name="transferAdults"
                    >
                      {Array.from({ length: 10 }).map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-[#303030]">
                      {text.transferChildren} (+{formatXPF(product.transferOptions?.transferPriceChild ?? 0)})
                    </span>
                    <select
                      className="w-full border border-[#b4b4b4] px-4 py-3 text-[22px] text-[#444]"
                      defaultValue="0"
                      name="transferChildren"
                    >
                      {Array.from({ length: 10 }).map((_, index) => (
                        <option key={index} value={index}>
                          {index}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}

              <button
                className="mt-8 inline-flex bg-[#a984cf] px-8 py-4 font-[Roboto_Condensed,sans-serif] text-[22px] uppercase text-white transition hover:bg-[#8b68b5]"
                type="submit"
              >
                {text.reserve}
              </button>
            </form>
          ) : (
            <div className="mt-12 border border-[#eadfd1] bg-[#fffaf4] p-8">
              <h2 className="font-[Dosis,sans-serif] text-[32px] font-normal uppercase text-[#0b4b54]">
                {text.quote}
              </h2>
              {product.weddingOptions?.length ? (
                <ul className="mt-6 space-y-3 text-[22px] leading-[1.6] text-[#7a7a7a]">
                  {product.weddingOptions.map((option) => (
                    <li key={`${option.name}-${option.price}`}>
                      • {option.name} ({formatXPF(option.price)})
                    </li>
                  ))}
                </ul>
              ) : null}
              <Link
                className="mt-8 inline-flex bg-[#f1bf2c] px-8 py-4 font-[Roboto_Condensed,sans-serif] text-[20px] uppercase text-[#1c244b] no-underline transition hover:bg-[#ddb01c]"
                href={`/${locale}${text.contactHref}`}
              >
                {text.quote}
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
