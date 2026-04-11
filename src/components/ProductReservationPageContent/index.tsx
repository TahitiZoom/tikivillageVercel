import Link from 'next/link'

import { addBookingToCart } from '@/app/(frontend)/actions/bookingCart'
import { Media } from '@/components/Media'
import { ProductBookingForm } from '@/components/ProductBookingForm'
import { commerceProductsBySlug, formatXPF, type SupportedLocale } from '@/data/commerceProducts'
import type { Media as MediaResource, Product } from '@/payload-types'
import { resolveLocalizedValue } from '@/utilities/localizedValue'

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
    reservationCost: 'Coût de la réservation',
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
    reservationCost: 'Booking cost',
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
    reservationCost: '予約料金',
    contactHref: '/contact',
  },
} as const

const getMediaResource = (resource: unknown): MediaResource | null => {
  if (resource && typeof resource === 'object' && !Array.isArray(resource)) {
    return resource as MediaResource
  }

  return null
}

export function ProductReservationPageContent({ locale, product }: Props) {
  const source = commerceProductsBySlug[product.slug]
  const text = copy[locale]
  const productName = resolveLocalizedValue(product.name, locale, source?.name[locale] ?? product.slug)
  const price = product.pricing?.displayPrice ?? product.pricing?.priceAdult ?? 0
  const paragraphs = source?.descriptionParagraphs[locale] ?? []
  const highlights = source?.highlights[locale] ?? []
  const tags = source?.tags[locale] ?? []
  const featuredImage = getMediaResource(product.featuredImage)
  const galleryMedia = (product.gallery ?? [])
    .map((item) => getMediaResource(item?.image))
    .filter(Boolean) as MediaResource[]
  const fallbackGallery = source?.gallery?.length ? source.gallery : ['/images/village.jpg']
  const primaryVisual = featuredImage

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-12">
      <div className="mb-12 font-[Roboto_Condensed,sans-serif] text-[18px] uppercase text-[#8d8d8d]">
        <Link href={`/${locale}`}>{text.breadcrumbHome}</Link>
        <span> / </span>
        <Link href={`/${locale}/reservations`}>{text.breadcrumbCatalog}</Link>
        <span> / </span>
        <span>{productName}</span>
      </div>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <section>
          <div className="overflow-hidden bg-[#f2f5f7]">
            {primaryVisual ? (
              <Media
                className="relative block h-[470px] w-full"
                imgClassName="h-full w-full object-cover"
                resource={primaryVisual}
              />
            ) : (
              <img src={fallbackGallery[0]} alt={productName} className="h-[470px] w-full object-cover" />
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {galleryMedia.length
              ? galleryMedia.slice(0, 4).map((image, index) => (
                  <div key={`${image.id}-${index}`} className="overflow-hidden bg-[#f2f5f7]">
                    <Media
                      className="relative block h-[120px] w-full"
                      imgClassName="h-full w-full object-cover"
                      resource={image}
                    />
                  </div>
                ))
              : fallbackGallery.slice(0, 4).map((image) => (
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
            {productName}
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
            <form action={addBookingToCart}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="slug" value={product.slug} />
              <ProductBookingForm labels={text} locale={locale} product={product} />
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
                      • {resolveLocalizedValue(option.name, locale, '')} ({formatXPF(option.price)})
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
