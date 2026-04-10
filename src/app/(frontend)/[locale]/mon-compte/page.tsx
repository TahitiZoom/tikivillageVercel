const copy = {
  fr: {
    title: 'Mon compte',
    body:
      'L espace client sera branche sur les futures reservations et commandes. La collection users est preparee pour accueillir les clients et leurs reservations.',
  },
  en: {
    title: 'My account',
    body:
      'The customer area will be connected to future bookings and orders. The users collection is now ready to host customers and their bookings.',
  },
  ja: {
    title: 'マイアカウント',
    body:
      'この顧客エリアは、今後の予約と注文に接続されます。users コレクションは、顧客とその予約を保持できるようになりました。',
  },
} as const

export default async function MonComptePage({
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
    </main>
  )
}
