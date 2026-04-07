import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

// This endpoint updates the header menu items to English
// "Accueil" -> "Home", "A propos" -> "About"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    // Check authentication
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    // Get current header
    const header = await payload.findGlobal({ slug: 'header' })

    if (!header || !header.navItems) {
      return NextResponse.json({ error: 'Header non trouve' }, { status: 404 })
    }

    // Translation map
    const translations: Record<string, string> = {
      'Accueil': 'Home',
      'A propos': 'About',
      // Add more translations here if needed
    }

    // Update nav items labels
    const updatedNavItems = header.navItems.map((item: any) => {
      if (item.link && item.link.label) {
        const translatedLabel = translations[item.link.label] || item.link.label
        return {
          ...item,
          link: {
            ...item.link,
            label: translatedLabel,
          },
        }
      }
      return item
    })

    // Save updated header
    await payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: updatedNavItems,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Menu mis a jour avec succes',
      navItems: updatedNavItems.map((item: any) => item.link?.label),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET to see current menu items
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    const header = await payload.findGlobal({ slug: 'header' })

    return NextResponse.json({
      navItems: header?.navItems?.map((item: any) => ({
        label: item.link?.label,
        url: item.link?.url || item.link?.reference?.value?.slug,
        type: item.link?.type,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
