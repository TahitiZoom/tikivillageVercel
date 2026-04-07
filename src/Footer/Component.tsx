import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer } from '@/payload-types'
import { FooterClient } from '@/components/FooterClient'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  return <FooterClient navItems={navItems} />
}
