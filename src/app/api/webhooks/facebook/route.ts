import { NextRequest, NextResponse } from 'next/server'
import { syncFacebook } from '@/lib/facebook/syncFacebook'

export const runtime = 'nodejs'
export const maxDuration = 300

type MetaWebhookEntry = {
  id?: string
  time?: number
  changes?: Array<{
    field?: string
    value?: Record<string, unknown>
  }>
}

type MetaWebhookPayload = {
  object?: string
  entry?: MetaWebhookEntry[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const verifyToken = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const expectedToken = process.env.FB_WEBHOOK_VERIFY_TOKEN

  if (!expectedToken) {
    return new NextResponse('FB_WEBHOOK_VERIFY_TOKEN is missing', { status: 500 })
  }

  if (mode === 'subscribe' && verifyToken === expectedToken && challenge) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MetaWebhookPayload

    // On ne traite que les webhooks Page
    if (body.object !== 'page') {
      return NextResponse.json({ ok: true, ignored: true, reason: 'not_page_object' })
    }

    const entries = body.entry || []

    // Détecte au moins un changement feed
    const hasFeedChange = entries.some((entry) =>
      (entry.changes || []).some((change) => change.field === 'feed'),
    )

    // Si ce n'est pas un événement feed, on acknowledge sans lancer de sync
    if (!hasFeedChange) {
      return NextResponse.json({ ok: true, ignored: true, reason: 'not_feed_change' })
    }

    // Déclenche une petite synchro immédiate
    const result = await syncFacebook({ limit: 5 })

    return NextResponse.json({
      ok: true,
      triggered: true,
      result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
