import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all frontend routes, but exclude admin, api, _next internals, and static files
  matcher: [
    '/((?!api|_next|_vercel|admin|favicon\\.ico|favicon\\.svg|robots\\.txt|sitemap\\.xml|media).*)',
  ],
}
