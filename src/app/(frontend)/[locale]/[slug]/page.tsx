import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { routing } from '@/i18n/routing'
import { ContactPageContent } from '@/components/ContactPageContent'
import { CentreCulturelPageContent } from '@/components/CentreCulturelPageContent'
import { ShowPolynesienPageContent } from '@/components/ShowPolynesienPageContent'
import { MariagesPageContent } from '@/components/MariagesPageContent'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })

    const slugs = pages.docs
      .filter((doc) => doc.slug !== 'home')
      .map(({ slug }) => slug)
      .filter(Boolean) as string[]

    return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
  } catch (_err) {
    return []
  }
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', locale = 'fr' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({ slug: decodedSlug, locale, draft })

  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  if (decodedSlug === 'contact') {
    return (
      <article>
        <PageClient />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <ContactPageContent locale={locale} page={page} />
      </article>
    )
  }

  if (decodedSlug === 'centre-culturel') {
    return (
      <article>
        <PageClient />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <CentreCulturelPageContent locale={locale} page={page} />
      </article>
    )
  }

  if (decodedSlug === 'show-polynesien') {
    return (
      <article>
        <PageClient />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <ShowPolynesienPageContent locale={locale} page={page} />
      </article>
    )
  }

  if (decodedSlug === 'mariages') {
    return (
      <article>
        <PageClient />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <MariagesPageContent locale={locale} page={page} />
      </article>
    )
  }

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', locale = 'fr' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({ slug: decodedSlug, locale, draft })
  return generateMeta({ doc: page })
}
