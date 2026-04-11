import { redirect } from 'next/navigation'

export default async function PrestationsPage({
  params,
}: {
  params: Promise<{ locale: 'fr' | 'en' | 'ja' }>
}) {
  const { locale } = await params
  redirect(`/${locale}/reservations`)
}
