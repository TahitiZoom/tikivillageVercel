import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

const PAGE_QUERY_TIMEOUT_MS = 5000

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        reject(new Error(`Page query timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    }),
  ])
}

export const queryPageBySlug = cache(
  async ({ slug, locale, draft }: { slug: string; locale: string; draft: boolean }) => {
    try {
      const payload = await getPayload({ config: configPromise })

      const result = await withTimeout(
        payload.find({
          collection: 'pages',
          draft,
          depth: 1,
          limit: 1,
          pagination: false,
          overrideAccess: draft,
          locale: locale as 'fr' | 'en' | 'ja',
          where: { slug: { equals: slug } },
        }),
        PAGE_QUERY_TIMEOUT_MS,
      )

      return result.docs?.[0] || null
    } catch (error) {
      console.error(`[queryPageBySlug] Failed to load page "${slug}" for locale "${locale}"`, error)
      return null
    }
  },
)
