import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

interface BulkUpdateRequest {
  ids: number[]
  field: string
  value: unknown
}

interface BulkUpdateResult {
  success: boolean
  updated: number
  errors: string[]
}

const ALLOWED_FIELDS = ['categories', 'authors', '_status', 'publishedAt']

export async function POST(request: NextRequest): Promise<NextResponse<BulkUpdateResult>> {
  const result: BulkUpdateResult = {
    success: false,
    updated: 0,
    errors: [],
  }

  try {
    const payload = await getPayload({ config })

    // Check authentication
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json(
        { ...result, errors: ['Non authentifie. Veuillez vous connecter.'] },
        { status: 401 }
      )
    }

    const body: BulkUpdateRequest = await request.json()
    const { ids, field, value } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { ...result, errors: ['Aucun post selectionne'] },
        { status: 400 }
      )
    }

    if (!field || !ALLOWED_FIELDS.includes(field)) {
      return NextResponse.json(
        { ...result, errors: [`Champ invalide. Champs autorises: ${ALLOWED_FIELDS.join(', ')}`] },
        { status: 400 }
      )
    }

    // Update each post
    for (const id of ids) {
      try {
        await payload.update({
          collection: 'posts',
          id,
          data: {
            [field]: value,
          },
        })
        result.updated++
      } catch (error) {
        result.errors.push(`Erreur sur post ${id}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      }
    }

    result.success = result.updated > 0
    return NextResponse.json(result)
  } catch (error) {
    result.errors.push(`Erreur generale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    return NextResponse.json(result, { status: 500 })
  }
}

// GET endpoint to fetch available values for relationship fields
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })

    // Check authentication
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const field = request.nextUrl.searchParams.get('field')

    if (field === 'categories') {
      const categories = await payload.find({
        collection: 'categories',
        limit: 100,
      })
      return NextResponse.json({ options: categories.docs.map(c => ({ id: c.id, title: c.title })) })
    }

    if (field === 'authors') {
      const users = await payload.find({
        collection: 'users',
        limit: 100,
      })
      return NextResponse.json({ options: users.docs.map(u => ({ id: u.id, title: u.name || u.email })) })
    }

    if (field === '_status') {
      return NextResponse.json({ options: [{ id: 'draft', title: 'Brouillon' }, { id: 'published', title: 'Publie' }] })
    }

    return NextResponse.json({ options: [] })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
