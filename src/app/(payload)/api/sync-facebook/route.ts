import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { parseSyncParamsFromURL, syncFacebook, SyncResult } from '@/lib/facebook/syncFacebook'

// SSE endpoint for real-time progress
export async function GET(request: NextRequest): Promise<Response> {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const payload = await getPayload({ config })

        const cronSecret = process.env.CRON_SECRET
        const authHeader = request.headers.get('authorization')
        const isCron = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)

        if (!isCron) {
          const authResult = await payload.auth({ headers: request.headers })
          if (!authResult.user) {
            send({ type: 'error', message: 'Non authentifie. Veuillez vous connecter.' })
            controller.close()
            return
          }
        }

        const { limit, since, until } = parseSyncParamsFromURL(request.url)

        await syncFacebook({
          limit,
          since,
          until,
          onMessage: send,
        })

        controller.close()
      } catch (error) {
        send({
          type: 'error',
          message: `Erreur generale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

// Keep POST for backwards compatibility
export async function POST(request: NextRequest): Promise<NextResponse<SyncResult>> {
  const result: SyncResult = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: [],
  }

  try {
    const payload = await getPayload({ config })

    const cronSecret = process.env.CRON_SECRET
    const authHeader = request.headers.get('authorization')
    const isCron = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)

    if (!isCron) {
      const authResult = await payload.auth({ headers: request.headers })
      if (!authResult.user) {
        return NextResponse.json(
          { ...result, errors: ['Non authentifie. Veuillez vous connecter.'] },
          { status: 401 },
        )
      }
    }

    const { limit, since, until } = parseSyncParamsFromURL(request.url)
    const syncResult = await syncFacebook({ limit, since, until })

    return NextResponse.json(syncResult, { status: syncResult.success ? 200 : 500 })
  } catch (error) {
    result.errors.push(
      `Erreur generale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
    )
    return NextResponse.json(result, { status: 500 })
  }
}
