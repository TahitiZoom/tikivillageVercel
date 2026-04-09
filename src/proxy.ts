import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match frontend routes only — exclude Payload admin, API, Next.js internals,
  // Payload /next/* internal routes, static assets, and files with extensions
  matcher: [
    '/((?!api|_next|_vercel|admin|next|fonts|media|.*\\.[^/]+$).*)',
  ],
}
