import type { Metadata } from 'next'

import { HomePageContent } from '@/components/HomePageContent'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { type RequiredDataFromCollectionSlug } from 'payload'
import { homeStatic } from '@/endpoints/seed/home-static'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { draftMode } from 'next/headers'
import React from 'react'

type Args = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'fr' } = await paramsPromise

  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({
    slug: 'home',
    locale,
    draft,
  })

  if (!page) {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url="/home" />
  }

  const { hero } = page

  return (
    <article className="pb-24">
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} />
      <HomePageContent page={page as never} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'fr' } = await paramsPromise
  const page = await queryPageBySlug({ slug: 'home', locale, draft })
  return generateMeta({ doc: page })
}
