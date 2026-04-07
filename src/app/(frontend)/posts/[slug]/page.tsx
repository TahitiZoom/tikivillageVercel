import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichTextWithoutMedia, { extractMediaFromContent } from '@/components/RichText/withoutMedia'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { MasonryGallery } from '@/components/MasonryGallery'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  // Fetch previous and next posts for navigation
  const payload = await getPayload({ config: configPromise })

  const [prevResult, nextResult, firstResult, lastResult] = await Promise.all([
    // Previous post (older)
    payload.find({
      collection: 'posts',
      where: {
        publishedAt: { less_than: post.publishedAt },
        _status: { equals: 'published' },
      },
      sort: '-publishedAt',
      limit: 1,
      select: { title: true, slug: true },
    }),
    // Next post (newer)
    payload.find({
      collection: 'posts',
      where: {
        publishedAt: { greater_than: post.publishedAt },
        _status: { equals: 'published' },
      },
      sort: 'publishedAt',
      limit: 1,
      select: { title: true, slug: true },
    }),
    // First post (oldest)
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: 'publishedAt',
      limit: 1,
      select: { title: true, slug: true },
    }),
    // Last post (newest)
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1,
      select: { title: true, slug: true },
    }),
  ])

  const prevPost = prevResult.docs[0] || null
  const nextPost = nextResult.docs[0] || null
  const firstPost = firstResult.docs[0] || null
  const lastPost = lastResult.docs[0] || null

  // Extract media from content for masonry gallery
  const contentMedia = extractMediaFromContent(post.content as any)

  return (
    <article className="pt-24 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichTextWithoutMedia className="max-w-[48rem] mx-auto" data={post.content ?? { root: { type: "root", children: [], direction: null, format: "", indent: 0, version: 1 } }} enableGutter={false} />

          {/* Masonry Gallery for post images */}
          {contentMedia.length > 0 && (
            <div className="mt-12 max-w-6xl mx-auto">
              <MasonryGallery images={contentMedia} />
            </div>
          )}

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>

      {/* Post Navigation */}
      <nav className="container mt-12 py-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            {firstPost && firstPost.slug !== post.slug && (
              <a
                href={`/posts/${firstPost.slug}`}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                title={firstPost.title}
              >
                Premier
              </a>
            )}
            {prevPost && (
              <a
                href={`/posts/${prevPost.slug}`}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
                title={prevPost.title}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Precedent
              </a>
            )}
          </div>

          <a
            href="/editorial"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Tous les articles
          </a>

          <div className="flex gap-4">
            {nextPost && (
              <a
                href={`/posts/${nextPost.slug}`}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
                title={nextPost.title}
              >
                Suivant
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            )}
            {lastPost && lastPost.slug !== post.slug && (
              <a
                href={`/posts/${lastPost.slug}`}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                title={lastPost.title}
              >
                Dernier
              </a>
            )}
          </div>
        </div>
      </nav>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
