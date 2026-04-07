import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

interface DuplicateGroup {
  facebookId: string
  posts: Array<{ id: number; title: string; createdAt: string }>
}

interface FindDuplicatesResult {
  success: boolean
  duplicates: DuplicateGroup[]
  totalDuplicates: number
}

export async function GET(request: NextRequest): Promise<NextResponse<FindDuplicatesResult>> {
  try {
    const payload = await getPayload({ config })

    // Check authentication
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json(
        { success: false, duplicates: [], totalDuplicates: 0 },
        { status: 401 }
      )
    }

    // Find all posts with facebookId
    const posts = await payload.find({
      collection: 'posts',
      where: {
        facebookId: { exists: true },
      },
      limit: 1000,
      sort: 'createdAt',
    })

    // Group by facebookId
    const groupedByFbId: Record<string, Array<{ id: number; title: string; createdAt: string }>> = {}

    for (const post of posts.docs) {
      const fbId = post.facebookId
      if (fbId) {
        if (!groupedByFbId[fbId]) {
          groupedByFbId[fbId] = []
        }
        groupedByFbId[fbId].push({
          id: post.id,
          title: post.title,
          createdAt: post.createdAt,
        })
      }
    }

    // Filter only those with duplicates
    const duplicates: DuplicateGroup[] = []
    for (const [facebookId, postGroup] of Object.entries(groupedByFbId)) {
      if (postGroup.length > 1) {
        duplicates.push({ facebookId, posts: postGroup })
      }
    }

    return NextResponse.json({
      success: true,
      duplicates,
      totalDuplicates: duplicates.reduce((sum, g) => sum + g.posts.length - 1, 0),
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, duplicates: [], totalDuplicates: 0 },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove duplicates (keep oldest)
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    // Check authentication
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json({ success: false, deleted: 0 }, { status: 401 })
    }

    // Find all posts with facebookId
    const posts = await payload.find({
      collection: 'posts',
      where: {
        facebookId: { exists: true },
      },
      limit: 1000,
      sort: 'createdAt',
    })

    // Group by facebookId
    const groupedByFbId: Record<string, number[]> = {}

    for (const post of posts.docs) {
      const fbId = post.facebookId
      if (fbId) {
        if (!groupedByFbId[fbId]) {
          groupedByFbId[fbId] = []
        }
        groupedByFbId[fbId].push(post.id)
      }
    }

    // Delete duplicates (keep the first/oldest one)
    let deleted = 0
    for (const postIds of Object.values(groupedByFbId)) {
      if (postIds.length > 1) {
        // Skip the first (oldest), delete the rest
        for (let i = 1; i < postIds.length; i++) {
          try {
            await payload.delete({
              collection: 'posts',
              id: postIds[i],
            })
            deleted++
          } catch {
            // Skip errors
          }
        }
      }
    }

    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    return NextResponse.json({ success: false, deleted: 0 }, { status: 500 })
  }
}
