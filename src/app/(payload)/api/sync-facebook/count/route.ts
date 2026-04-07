import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

interface FacebookApiResponse {
  data: Array<{ id: string }>
  paging?: {
    next?: string
  }
  error?: {
    message: string
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    // Check authentication via cookies
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json(
        { error: 'Non authentifie' },
        { status: 401 }
      )
    }

    // Get Facebook credentials from environment
    const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    const pageId = process.env.FB_PAGE_ID || process.env.FACEBOOK_PAGE_ID

    if (!pageAccessToken || !pageId) {
      return NextResponse.json(
        { error: 'Variables Facebook manquantes' },
        { status: 500 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const sinceStr = searchParams.get('since')
    const untilStr = searchParams.get('until')

    let since: number | undefined
    if (sinceStr) {
      const sinceDate = new Date(sinceStr)
      if (!isNaN(sinceDate.getTime())) {
        since = Math.floor(sinceDate.getTime() / 1000)
      }
    }

    let until: number | undefined
    if (untilStr) {
      const untilDate = new Date(untilStr)
      if (!isNaN(untilDate.getTime())) {
        untilDate.setHours(23, 59, 59, 999)
        until = Math.floor(untilDate.getTime() / 1000)
      }
    }

    // If no period specified, return null (we don't count)
    if (!since && !until) {
      return NextResponse.json({ count: null })
    }

    // Build URL to count posts (only fetch IDs for speed)
    let url = `https://graph.facebook.com/v22.0/${pageId}/posts?fields=id&limit=100&access_token=${pageAccessToken}`
    if (since) url += `&since=${since}`
    if (until) url += `&until=${until}`

    // Paginate to count all posts
    let count = 0
    let currentUrl: string | null = url

    while (currentUrl) {
      const response = await fetch(currentUrl)
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Erreur API Facebook' },
          { status: response.status }
        )
      }

      const data: FacebookApiResponse = await response.json()
      if (data.error) {
        return NextResponse.json(
          { error: data.error.message },
          { status: 400 }
        )
      }

      count += (data.data || []).length
      currentUrl = data.paging?.next || null
    }

    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
