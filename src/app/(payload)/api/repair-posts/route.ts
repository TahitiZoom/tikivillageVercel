import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    // Check authentication
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Find all posts without proper version entries
    const posts = await payload.find({
      collection: 'posts',
      limit: 100,
      depth: 0,
    })

    let repaired = 0
    const errors: string[] = []

    for (const post of posts.docs) {
      try {
        // Re-save each post to create version entries
        await payload.update({
          collection: 'posts',
          id: post.id,
          data: {
            title: post.title,
            _status: 'published',
          },
          draft: false,
        })
        repaired++
      } catch (err) {
        errors.push(`Post ${post.id}: ${err instanceof Error ? err.message : 'Erreur'}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${repaired} post(s) réparé(s)`,
      total: posts.docs.length,
      repaired,
      errors,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
