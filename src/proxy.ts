import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/maintenance'
  ) {
    return NextResponse.next()
  }

  const maintenanceCookie = request.cookies.get('maintenance-bypass')
  if (maintenanceCookie?.value === process.env.PAYLOAD_SECRET) {
    return NextResponse.next()
  }

  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.tahitizoom.pf'
    const res = await fetch(`${serverUrl}/api/globals/settings?depth=0`, {
      cache: 'no-store',
    })
    const data = await res.json()

    if (data?.maintenanceMode === true) {
      const url = request.nextUrl.clone()
      url.pathname = '/maintenance'
      return NextResponse.redirect(url, { status: 302 })
    }
  } catch (e) {
    console.error('Proxy error:', e)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|logo|og|robots|sitemap).*)'],
}
