import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL

  if (!baseURL) {
    return NextResponse.json(
      { ok: false, error: 'NEXT_PUBLIC_SERVER_URL is missing' },
      { status: 500 },
    )
  }

  try {
    const target = new URL('/api/sync-facebook', baseURL)
    target.searchParams.set('limit', '25')

    const response = await fetch(target.toString(), {
      method: 'POST',
      headers: {
        authorization: `Bearer ${cronSecret}`,
        'x-cron-job': 'facebook-sync',
      },
      cache: 'no-store',
    })

    const text = await response.text()

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
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
