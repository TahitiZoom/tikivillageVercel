import Link from 'next/link'

import { commerceProductsBySlug, formatXPF } from '@/data/commerceProducts'
import { Media } from '@/components/Media'
import type { Media as MediaResource, Product } from '@/payload-types'
import { resolveLocalizedValue } from '@/utilities/localizedValue'

type Props = {
  locale: 'fr' | 'en' | 'ja'
  products: Product[]
}

const copy = {
  fr: {
    eyebrow: 'NOS PRESTATIONS',
    title: 'RESERVATIONS',
    body: "Retrouvez l'ensemble des expériences réservables du Tiki Village : ateliers culturels, soirée polynésienne et formules mariage.",
    cta: 'VOIR LE DETAIL',
  },
  en: {
    eyebrow: 'OUR SERVICES',
    title: 'BOOKINGS',
    body: 'Browse all Tiki Village bookable experiences: cultural workshops, Polynesian evening and wedding formulas.',
    cta: 'VIEW DETAILS',
  },
  ja: {
    eyebrow: 'サービス一覧',
    title: 'ご予約',
    body: '文化アトリエ、ポリネシアンナイト、ウェディングプランなど、Tiki Village の体験一覧です。',
    cta: '詳細を見る',
  },
} as const

export function ReservationsPageContent({ locale, products }: Props) {
  const text = copy[locale]

  const getFeaturedMedia = (resource: unknown): MediaResource | null => {
    if (resource && typeof resource === 'object' && 'url' in resource) {
      return resource as MediaResource
    }

    return null
  }

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-18">
      <div className="mx-auto max-w-[980px] text-center">
        <div className="mb-5 inline-flex items-center gap-3 text-[14px] uppercase tracking-[0.35em] text-[#1ad7c1]">
          <span className="h-px w-16 bg-[#1ad7c1]" />
          <span>{text.eyebrow}</span>
          <span className="h-px w-16 bg-[#1ad7c1]" />
        </div>
        <h1 className="font-[Dosis,sans-serif] text-[44px] font-normal uppercase tracking-[0.06em] text-[#0b4b54]">
          {text.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[900px] text-[25px] leading-[1.65] text-[#7a7a7a]">
          {text.body}
        </p>
      </div>

      <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => {
          const fallback = commerceProductsBySlug[product.slug]
          const image = fallback?.image ?? '/images/village.jpg'
          const featuredMedia = getFeaturedMedia(product.featuredImage)
          const price = product.pricing?.displayPrice ?? product.pricing?.priceAdult ?? 0
          const productName = resolveLocalizedValue(product.name, locale, fallback?.name[locale] ?? product.slug)
          const shortDescription = resolveLocalizedValue(
            product.shortDescription,
            locale,
            fallback?.shortDescription[locale] ?? '',
          )

          return (
            <article key={product.id} className="group">
              <Link className="block overflow-hidden bg-[#f3f6f8]" href={`/${locale}/reservations/${product.slug}`}>
                {featuredMedia ? (
                  <Media
                    className="relative block h-[255px] w-full"
                    imgClassName="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    resource={featuredMedia}
                  />
                ) : (
                  <img
                    src={image}
                    alt={productName}
                    className="h-[255px] w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                )}
              </Link>
              <div className="pt-5">
                <h2 className="font-[Roboto_Condensed,sans-serif] text-[24px] font-normal uppercase text-[#e04b86]">
                  <Link href={`/${locale}/reservations/${product.slug}`}>{productName}</Link>
                </h2>
                <p className="mt-3 font-[Dosis,sans-serif] text-[30px] font-normal text-[#1d1d1d]">
                  {formatXPF(price)}
                </p>
                <p className="mt-4 min-h-[108px] text-[20px] leading-[1.7] text-[#7a7a7a]">
                  {shortDescription}
                </p>
                <Link
                  className="mt-5 inline-flex bg-[#033537] px-6 py-3 font-[Roboto_Condensed,sans-serif] text-[17px] uppercase tracking-[0.08em] text-white no-underline transition hover:bg-[#0b4b54]"
                  href={`/${locale}/reservations/${product.slug}`}
                >
                  {text.cta}
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
