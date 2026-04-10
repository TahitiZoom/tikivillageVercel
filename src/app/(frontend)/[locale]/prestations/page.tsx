import Link from 'next/link'

const copy = {
  fr: {
    title: 'Nos prestations',
    body:
      'Cette page preparera le catalogue des prestations reservables de Tiki Village. La collection commerce products est maintenant en place pour demarrer la phase 3.',
    cta: 'Voir les reservations',
  },
  en: {
    title: 'Our services',
    body:
      'This page will host the Tiki Village bookable services catalog. The commerce products collection is now in place to start phase 3.',
    cta: 'View reservations',
  },
  ja: {
    title: 'サービス一覧',
    body:
      'このページは、Tiki Village の予約可能なサービス一覧を表示するための土台です。phase 3 開始用に commerce products コレクションを追加しました。',
    cta: '予約を見る',
  },
} as const

export default async function PrestationsPage({
  params,
}: {
  params: Promise<{ locale: 'fr' | 'en' | 'ja' }>
}) {
  const { locale } = await params
  const text = copy[locale] ?? copy.fr

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-24">
      <h1 className="mb-6 font-[Dosis,sans-serif] text-[30px] font-normal uppercase text-[#0e4850]">
        {text.title}
      </h1>
      <p className="max-w-[860px] text-[25px] leading-[1.7] text-[#7a7a7a]">{text.body}</p>
      <Link
        className="mt-10 inline-block bg-[#033537] px-8 py-4 font-[Roboto_Condensed,sans-serif] text-[18px] uppercase text-white no-underline"
        href={`/${locale}/reservations`}
      >
        {text.cta}
      </Link>
    </main>
  )
}
