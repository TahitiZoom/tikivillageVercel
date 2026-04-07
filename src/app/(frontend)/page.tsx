import configPromise from '@payload-config'
import { getPayload } from 'payload'
import HomePageClient from './page.client'

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 30,
    depth: 1,
    overrideAccess: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
  })

  const allPosts = (result.docs || []).filter((p: any) => p.slug && p.coverImage?.url)
  const posts = shuffleArray(allPosts).slice(0, 6)

  return <HomePageClient posts={posts} />
}
