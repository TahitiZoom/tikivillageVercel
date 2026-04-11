import Link from 'next/link'

type Props = {
  params: Promise<{
    locale: 'fr' | 'en' | 'ja'
  }>
  searchParams: Promise<{
    booking?: string
  }>
}

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { booking } = await searchParams

  return (
    <main className="mx-auto max-w-[900px] px-6 py-24 text-center">
      <h1 className="font-[Dosis,sans-serif] text-[44px] font-normal uppercase text-[#0b4b54]">
        Merci pour votre réservation
      </h1>
      <p className="mt-6 text-[25px] leading-[1.7] text-[#7a7a7a]">
        Votre demande a bien été enregistrée. Référence : <strong>{booking ?? 'en cours'}</strong>.
      </p>
      <p className="mt-4 text-[23px] leading-[1.7] text-[#7a7a7a]">
        L’étape PayZen sera branchée ensuite sur cette commande en attente.
      </p>
      <Link
        className="mt-8 inline-flex bg-[#033537] px-8 py-4 font-[Roboto_Condensed,sans-serif] text-[20px] uppercase text-white no-underline"
        href={`/${locale}/reservations`}
      >
        Retour aux réservations
      </Link>
    </main>
  )
}
