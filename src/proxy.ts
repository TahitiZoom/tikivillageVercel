import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match frontend routes only — exclude Payload admin, API, Next.js internals,
  // Payload /next/* internal routes (seed, preview, exit-preview), and static assets
  matcher: [
    '/((?!api|_next|_vercel|admin|next|favicon\\.ico|favicon\\.svg|robots\\.txt|sitemap\\.xml|media).*)',
  ],
}
