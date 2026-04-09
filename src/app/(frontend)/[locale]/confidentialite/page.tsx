import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return {
    title: t('title'),
    description: t('desc'),
  }
}

export default function ConfidentialitePage() {
  const t = useTranslations('privacy')

  return (
    <article className="container max-w-3xl py-16 pb-24">
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t('updated')}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. {t('controllerTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('controllerText')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. {t('dataTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('dataText')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. {t('cookiesTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('cookiesText')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. {t('retentionTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('retentionText')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. {t('rightsTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('rightsText')}{' '}
          <a href="mailto:accueil@tikivillage.pf" className="underline hover:text-tiki-primary">
            accueil@tikivillage.pf
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. {t('securityTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('securityText')}</p>
      </section>
    </article>
  )
}
