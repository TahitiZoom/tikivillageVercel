import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return {
    title: t('mentionsTitle'),
    description: t('mentionsDesc'),
  }
}

export default function MentionsLegalesPage() {
  const t = useTranslations('legal')

  return (
    <article className="container max-w-3xl py-16 pb-24">
      <h1 className="text-3xl font-bold mb-8">{t('mentionsTitle')}</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">{t('editorTitle')}</h2>
        <p className="text-muted-foreground leading-relaxed">{t('editorText')}</p>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>
            <strong>{t('company')} :</strong> TIKI VILLAGE MOOREA
          </li>
          <li>
            <strong>{t('registrationLabel')} :</strong> {t('registrationValue')}
          </li>
          <li>
            <strong>{t('address')} :</strong> Moorea, 98728, Polynésie Française
          </li>
          <li>
            <strong>{t('email')} :</strong>{' '}
            <a
              href="mailto:accueil@tikivillage.pf"
              className="underline hover:text-tiki-primary"
            >
              accueil@tikivillage.pf
            </a>
          </li>
          <li>
            <strong>{t('website')} :</strong>{' '}
            <a
              href="https://www.tikivillage.pf"
              className="underline hover:text-tiki-primary"
            >
              https://www.tikivillage.pf
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">{t('hostingTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('hostingText')}</p>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>
            <strong>Vercel Inc.</strong>
          </li>
          <li>340 Pine Street, San Francisco, CA 94104, USA</li>
          <li>
            <a
              href="https://vercel.com"
              className="underline hover:text-tiki-primary"
            >
              https://vercel.com
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">{t('ipTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('ipText')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">{t('liabilityTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('liabilityText')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">{t('lawTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('lawText')}</p>
      </section>
    </article>
  )
}
