import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

interface FacebookAttachment {
  media?: { image?: { src: string } }
  type?: string
  url?: string
  subattachments?: {
    data: Array<{
      media?: { image?: { src: string } }
      type?: string
      url?: string
    }>
  }
}

interface FacebookAttachmentsResponse {
  data: FacebookAttachment[]
  error?: { message: string }
}

interface LexicalNode {
  [x: string]: unknown
  type: string
  children?: LexicalNode[]
  fields?: {
    blockType?: string
    media?: number | { id: number }
    images?: Array<{ image: number | { id: number } }>
  }
}

interface LexicalContent {
  [x: string]: unknown
  root: {
    children: LexicalNode[]
    direction: 'ltr' | 'rtl' | null
    format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'
    indent: number
    type: string
    version: number
  }
}

interface UpdateResult {
  success: boolean
  postsUpdated: number
  photosAdded: number
  errors: string[]
}

// Download image from URL
async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const response = await fetch(url, { redirect: 'follow' })
    if (!response.ok) return null

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return { buffer, contentType }
  } catch {
    return null
  }
}

// Fetch all photo attachments for a Facebook post
async function fetchPostAttachments(postId: string, accessToken: string): Promise<string[]> {
  try {
    const url = `https://graph.facebook.com/v22.0/${postId}/attachments?fields=subattachments{media,type,url},media,type,url&access_token=${accessToken}`
    const response = await fetch(url)
    if (!response.ok) return []

    const data: FacebookAttachmentsResponse = await response.json()
    if (data.error || !data.data) return []

    const imageUrls: string[] = []

    for (const attachment of data.data) {
      if (attachment.subattachments?.data) {
        for (const sub of attachment.subattachments.data) {
          if (sub.type === 'photo' && sub.media?.image?.src) {
            imageUrls.push(sub.media.image.src)
          }
        }
      } else if (attachment.type === 'photo' && attachment.media?.image?.src) {
        imageUrls.push(attachment.media.image.src)
      }
    }

    return imageUrls
  } catch {
    return []
  }
}

// Extract existing media IDs from Lexical content
function getExistingMediaIds(content: LexicalContent | null): number[] {
  if (!content?.root?.children) return []

  const mediaIds: number[] = []

  function walkNodes(nodes: LexicalNode[]) {
    for (const node of nodes) {
      if (node.type === 'block' && node.fields) {
        if (node.fields.blockType === 'mediaBlock' && node.fields.media) {
          const mediaId = typeof node.fields.media === 'number'
            ? node.fields.media
            : node.fields.media.id
          if (mediaId) mediaIds.push(mediaId)
        }
        if (node.fields.blockType === 'galleryBlock' && node.fields.images) {
          for (const img of node.fields.images) {
            const mediaId = typeof img.image === 'number' ? img.image : img.image?.id
            if (mediaId) mediaIds.push(mediaId)
          }
        }
      }
      if (node.children) {
        walkNodes(node.children)
      }
    }
  }

  walkNodes(content.root.children)
  return mediaIds
}

// Add MediaBlock nodes to Lexical content
function addMediaBlocksToContent(content: LexicalContent, mediaIds: number[]): LexicalContent {
  const newChildren = [...content.root.children]

  let insertIndex = newChildren.length
  for (let i = newChildren.length - 1; i >= 0; i--) {
    const node = newChildren[i]
    if (node.type === 'paragraph' && node.children) {
      const textNode = node.children.find((c: LexicalNode & { text?: string }) => c.type === 'text')
      if (textNode && 'text' in textNode && typeof textNode.text === 'string' && textNode.text.includes('Stephane Sayeb')) {
        insertIndex = i + 1
        break
      }
    }
  }

  const mediaBlocks: LexicalNode[] = mediaIds.map(mediaId => ({
    type: 'block',
    fields: {
      blockType: 'mediaBlock',
      media: mediaId,
    },
  }))

  newChildren.splice(insertIndex, 0, ...mediaBlocks)

  return {
    root: {
      ...content.root,
      children: newChildren,
    },
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<UpdateResult>> {
  const result: UpdateResult = {
    success: false,
    postsUpdated: 0,
    photosAdded: 0,
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

    // Get Facebook credentials
    const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    const pageId = process.env.FB_PAGE_ID || process.env.FACEBOOK_PAGE_ID

    if (!pageAccessToken || !pageId) {
      return NextResponse.json(
        { ...result, errors: ['Variables Facebook manquantes (FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID)'] },
        { status: 500 }
      )
    }

    // Get all posts with a facebookId
    const postsResult = await payload.find({
      collection: 'posts',
      where: {
        facebookId: {
          exists: true,
        },
      },
      limit: 1000,
      depth: 1,
    })

    if (postsResult.docs.length === 0) {
      return NextResponse.json({
        ...result,
        success: true,
        errors: ['Aucun post avec facebookId trouve'],
      })
    }

    // Process each post
    for (const post of postsResult.docs) {
      if (!post.facebookId) continue

      try {
        const allImageUrls = await fetchPostAttachments(post.facebookId, pageAccessToken)
        if (allImageUrls.length === 0) continue

        const additionalUrls = allImageUrls.slice(1)
        if (additionalUrls.length === 0) continue

        const existingMediaIds = getExistingMediaIds(post.content as LexicalContent | null)
        if (existingMediaIds.length >= additionalUrls.length) continue

        const newMediaIds: number[] = []
        const postTitle = post.title?.slice(0, 50) || 'Sans titre'

        for (let imgIdx = existingMediaIds.length; imgIdx < additionalUrls.length; imgIdx++) {
          const imgUrl = additionalUrls[imgIdx]

          try {
            const imageData = await downloadImage(imgUrl)
            if (imageData) {
              const filename = `facebook-${post.facebookId}-${imgIdx + 1}.jpg`
              const mediaDoc = await payload.create({
                collection: 'media',
                data: {
                  alt: `${postTitle} - Photo ${imgIdx + 2}`,
                },
                file: {
                  data: imageData.buffer,
                  mimetype: imageData.contentType,
                  name: filename,
                  size: imageData.buffer.length,
                },
              })
              newMediaIds.push(mediaDoc.id)
              result.photosAdded++
            }
          } catch {
            // Skip this image
          }
        }

        if (newMediaIds.length === 0) continue

        const currentContent = post.content as LexicalContent | null
        if (!currentContent?.root) continue

        const updatedContent = addMediaBlocksToContent(currentContent, newMediaIds)

        await payload.update({
          collection: 'posts',
          id: post.id,
          data: {
            content: updatedContent,
          },
        })

        result.postsUpdated++
      } catch (postError) {
        result.errors.push(
          `Erreur post ${post.facebookId}: ${postError instanceof Error ? postError.message : 'Erreur inconnue'}`
        )
      }
    }

    result.success = true
    return NextResponse.json(result)
  } catch (error) {
    result.errors.push(`Erreur generale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    return NextResponse.json(result, { status: 500 })
  }
}
