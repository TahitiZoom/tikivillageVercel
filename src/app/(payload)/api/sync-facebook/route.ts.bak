import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

interface FacebookPost {
  id: string
  message?: string
  created_time: string
  full_picture?: string
  permalink_url: string
}

interface FacebookApiResponse {
  data: FacebookPost[]
  paging?: {
    cursors: { before: string; after: string }
    next?: string
  }
  error?: {
    message: string
    type: string
    code: number
  }
}

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

interface SyncResult {
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

// Cache for author ID and category ID to avoid repeated queries
let cachedAuthorId: number | null | undefined = undefined
let cachedCategoryId: number | null | undefined = undefined

function createLexicalContent(text: string, galleryMediaIds?: number[]): object {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())

  // Add signature paragraph
  paragraphs.push('✍ Stephane Sayeb')

  const children: object[] = paragraphs.map(paragraph => ({
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: paragraph.trim(),
        type: 'text',
        version: 1,
      },
    ],
    direction: null,
    format: 'start',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    textStyle: '',
  }))

  // Add gallery images as MediaBlock nodes if we have additional images
  if (galleryMediaIds && galleryMediaIds.length > 0) {
    for (const mediaId of galleryMediaIds) {
      children.push({
        type: 'block',
        version: 2,
        format: '',
        fields: {
          id: crypto.randomUUID(),
          blockName: '',
          blockType: 'mediaBlock',
          media: mediaId,
        },
      })
    }
  }

  return {
    root: {
      children,
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

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

async function fetchPostAttachments(
  postId: string,
  accessToken: string
): Promise<string[]> {
  try {
    const url = `https://graph.facebook.com/v22.0/${postId}/attachments?fields=subattachments{media,type,url},media,type,url&access_token=${accessToken}`
    const response = await fetch(url)
    if (!response.ok) return []

    const data: FacebookAttachmentsResponse = await response.json()
    if (data.error || !data.data) return []

    const imageUrls: string[] = []

    for (const attachment of data.data) {
      // Check for subattachments (multiple photos)
      if (attachment.subattachments?.data) {
        for (const sub of attachment.subattachments.data) {
          if (sub.type === 'photo' && sub.media?.image?.src) {
            imageUrls.push(sub.media.image.src)
          }
        }
      }
      // Single attachment
      else if (attachment.type === 'photo' && attachment.media?.image?.src) {
        imageUrls.push(attachment.media.image.src)
      }
    }

    return imageUrls
  } catch {
    return []
  }
}

function parseQueryParams(request: NextRequest): { limit: number | null; since?: number; until?: number } {
  const searchParams = request.nextUrl.searchParams

  // Parse limit: empty = no limit (null), otherwise max 100
  const limitStr = searchParams.get('limit')
  let limit: number | null = null
  if (limitStr && limitStr.trim() !== '') {
    const parsed = parseInt(limitStr, 10)
    if (!isNaN(parsed) && parsed > 0) {
      limit = Math.min(parsed, 100)
    }
  }

  // Parse since date (YYYY-MM-DD format) to Unix timestamp
  const sinceStr = searchParams.get('since')
  let since: number | undefined
  if (sinceStr) {
    const sinceDate = new Date(sinceStr)
    if (!isNaN(sinceDate.getTime())) {
      since = Math.floor(sinceDate.getTime() / 1000)
    }
  }

  // Parse until date (YYYY-MM-DD format) to Unix timestamp
  const untilStr = searchParams.get('until')
  let until: number | undefined
  if (untilStr) {
    const untilDate = new Date(untilStr)
    if (!isNaN(untilDate.getTime())) {
      // Set to end of day
      untilDate.setHours(23, 59, 59, 999)
      until = Math.floor(untilDate.getTime() / 1000)
    }
  }

  // Default behavior: if nothing specified, get last 10 posts
  if (limit === null && !since && !until) {
    limit = 10
  }

  return { limit, since, until }
}

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

        // Check authentication via cookies
        const authResult = await payload.auth({ headers: request.headers })
        if (!authResult.user) {
          send({ type: 'error', message: 'Non authentifie. Veuillez vous connecter.' })
          controller.close()
          return
        }

        // Get Facebook credentials from environment
        const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN
        const pageId = process.env.FB_PAGE_ID || process.env.FACEBOOK_PAGE_ID

        if (!pageAccessToken || !pageId) {
          send({ type: 'error', message: 'Variables Facebook manquantes (FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID)' })
          controller.close()
          return
        }

        // Parse query parameters for filtering
        const { limit, since, until } = parseQueryParams(request)

        // Determine fetch limit per request (100 is Facebook's max)
        const fetchLimit = limit === null ? 100 : Math.min(limit, 100)

        // Build Facebook Graph API URL with filters
        let fbUrl = `https://graph.facebook.com/v22.0/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url&limit=${fetchLimit}&access_token=${pageAccessToken}`

        if (since) fbUrl += `&since=${since}`
        if (until) fbUrl += `&until=${until}`

        send({ type: 'start', total: limit || 0, message: 'Connexion a Facebook...' })

        // Fetch all posts with pagination if no limit specified
        const allPosts: FacebookPost[] = []
        let currentUrl: string | null = fbUrl
        let pageNum = 0

        while (currentUrl) {
          const fbResponse = await fetch(currentUrl)

          if (!fbResponse.ok) {
            const errorText = await fbResponse.text()
            send({ type: 'error', message: `Erreur API Facebook: ${errorText.slice(0, 200)}` })
            controller.close()
            return
          }

          const fbData: FacebookApiResponse = await fbResponse.json()

          if (fbData.error) {
            send({ type: 'error', message: `Erreur Facebook: ${fbData.error.message}` })
            controller.close()
            return
          }

          allPosts.push(...fbData.data)
          pageNum++

          // Send pagination progress
          if (limit === null && fbData.paging?.next) {
            send({ type: 'info', message: `Page ${pageNum} : ${allPosts.length} posts recuperes...` })
          }

          // If we have a limit and reached it, stop
          if (limit !== null && allPosts.length >= limit) {
            allPosts.splice(limit) // Trim to exact limit
            break
          }

          // Continue pagination only if no limit (fetch all)
          currentUrl = limit === null ? (fbData.paging?.next || null) : null
        }

        const total = allPosts.length
        send({ type: 'start', total, message: `${total} posts trouves. Debut de la synchronisation...` })

        // Find or create "Reportage" category
        if (cachedCategoryId === undefined) {
          try {
            let categoryResult = await payload.find({
              collection: 'categories',
              where: { title: { equals: 'Reportage' } },
              limit: 1,
            })

            if (categoryResult.docs.length === 0) {
              // Create the category
              const newCategory = await payload.create({
                collection: 'categories',
                data: { title: 'Reportage', slug: 'reportage' },
                draft: false,
              })
              cachedCategoryId = newCategory.id
              send({ type: 'info', message: 'Categorie "Reportage" creee' })
            } else {
              cachedCategoryId = categoryResult.docs[0].id
            }
          } catch {
            cachedCategoryId = null
          }
        }

        // Find the author "Stephane Sayeb" (with caching)
        if (cachedAuthorId === undefined) {
          try {
            let usersResult = await payload.find({
              collection: 'users',
              where: { name: { equals: 'Stephane Sayeb' } },
              limit: 1,
            })

            if (usersResult.docs.length === 0) {
              usersResult = await payload.find({
                collection: 'users',
                where: { email: { equals: 'contact@tahitizoom.pf' } },
                limit: 1,
              })
            }

            cachedAuthorId = usersResult.docs.length > 0 ? usersResult.docs[0].id : null
          } catch {
            cachedAuthorId = null
          }
        }

        const authorId = cachedAuthorId
        const categoryId = cachedCategoryId

        let imported = 0
        let skipped = 0
        let errors = 0

        // Process each Facebook post
        for (let i = 0; i < allPosts.length; i++) {
          const fbPost = allPosts[i]
          const current = i + 1
          const postTitle = fbPost.message?.slice(0, 50) || 'Post Facebook'

          try {
            // Check if post already exists by facebookId
            const existingPost = await payload.find({
              collection: 'posts',
              where: { facebookId: { equals: fbPost.id } },
              limit: 1,
            })

            if (existingPost.docs.length > 0) {
              skipped++
              send({
                type: 'progress',
                current,
                total,
                post: postTitle,
                status: 'skipped',
                message: `${current}/${total} - Ignore (doublon) : ${postTitle}...`,
              })
              continue
            }

            send({
              type: 'progress',
              current,
              total,
              post: postTitle,
              status: 'importing',
              message: `${current}/${total} - Importation : ${postTitle}...`,
            })

            // Fetch all attachments (photos) for this post
            const allImageUrls = await fetchPostAttachments(fbPost.id, pageAccessToken)

            // Download and create media - first image is coverImage
            let coverMediaId: number | null = null
            const galleryMediaIds: number[] = []

            // Use full_picture as cover if available, otherwise first from attachments
            const coverUrl = fbPost.full_picture || allImageUrls[0]
            const additionalUrls = fbPost.full_picture
              ? allImageUrls.filter(url => url !== fbPost.full_picture)
              : allImageUrls.slice(1)

            if (coverUrl) {
              send({
                type: 'progress',
                current,
                total,
                post: postTitle,
                status: 'importing_image',
                message: `${current}/${total} - Telechargement image couverture...`,
              })

              const imageData = await downloadImage(coverUrl)
              if (imageData) {
                try {
                  const filename = `facebook-${fbPost.id}-cover.jpg`
                  const mediaDoc = await payload.create({
                    collection: 'media',
                    data: { alt: fbPost.message?.slice(0, 100) || 'Image Facebook' },
                    file: {
                      data: imageData.buffer,
                      mimetype: imageData.contentType,
                      name: filename,
                      size: imageData.buffer.length,
                    },
                  })
                  coverMediaId = mediaDoc.id
                } catch (mediaError) {
                  // Continue without cover image
                }
              }
            }

            // Download additional images for gallery
            if (additionalUrls.length > 0) {
              send({
                type: 'progress',
                current,
                total,
                post: postTitle,
                status: 'importing_image',
                message: `${current}/${total} - Telechargement ${additionalUrls.length} images supplementaires...`,
              })

              for (let imgIdx = 0; imgIdx < additionalUrls.length; imgIdx++) {
                const imgUrl = additionalUrls[imgIdx]
                try {
                  const imageData = await downloadImage(imgUrl)
                  if (imageData) {
                    const filename = `facebook-${fbPost.id}-${imgIdx + 1}.jpg`
                    const mediaDoc = await payload.create({
                      collection: 'media',
                      data: { alt: `${fbPost.message?.slice(0, 50) || 'Image Facebook'} - ${imgIdx + 2}` },
                      file: {
                        data: imageData.buffer,
                        mimetype: imageData.contentType,
                        name: filename,
                        size: imageData.buffer.length,
                      },
                    })
                    galleryMediaIds.push(mediaDoc.id)
                  }
                } catch {
                  // Skip this image
                }
              }
            }

            // Generate title from message
            const message = fbPost.message || ''
            const title = message.length > 0
              ? message.slice(0, 80) + (message.length > 80 ? '...' : '')
              : 'Post Facebook'

            // Create the post with gallery images in content
            const postData: Record<string, unknown> = {
              title,
              content: message
                ? createLexicalContent(message, galleryMediaIds)
                : createLexicalContent('', galleryMediaIds),
              facebookUrl: fbPost.permalink_url,
              facebookId: fbPost.id,
              publishedAt: fbPost.created_time,
              _status: 'published',
              meta: {
                title: `${title} | Tahiti Zoom — Stephane Sayeb`,
              },
            }

            if (coverMediaId) {
              postData.coverImage = coverMediaId
            }

            if (authorId) {
              postData.authors = [authorId]
            }

            if (categoryId) {
              postData.categories = [categoryId]
            }

            await payload.create({
              collection: 'posts',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: postData as any,
              draft: false,
            })

            imported++
            const imgCount = galleryMediaIds.length > 0 ? ` (+${galleryMediaIds.length} images)` : ''
            send({
              type: 'progress',
              current,
              total,
              post: postTitle,
              status: 'imported',
              message: `${current}/${total} - Importe : ${postTitle}...${imgCount}`,
            })
          } catch (postError) {
            errors++
            send({
              type: 'progress',
              current,
              total,
              post: postTitle,
              status: 'error',
              message: `${current}/${total} - Erreur : ${postTitle} - ${postError instanceof Error ? postError.message : 'Erreur inconnue'}`,
            })
          }
        }

        send({
          type: 'complete',
          imported,
          skipped,
          errors,
          message: `Termine : ${imported} importes, ${skipped} ignores, ${errors} erreurs`,
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

    // Check authentication via cookies
    const authResult = await payload.auth({ headers: request.headers })
    if (!authResult.user) {
      return NextResponse.json(
        { ...result, errors: ['Non authentifie. Veuillez vous connecter.'] },
        { status: 401 }
      )
    }

    // Get Facebook credentials from environment
    const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    const pageId = process.env.FB_PAGE_ID || process.env.FACEBOOK_PAGE_ID

    if (!pageAccessToken || !pageId) {
      return NextResponse.json(
        { ...result, errors: ['Variables Facebook manquantes (FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID)'] },
        { status: 500 }
      )
    }

    // Parse query parameters for filtering
    const { limit, since, until } = parseQueryParams(request)

    // Determine fetch limit per request (100 is Facebook's max)
    const fetchLimit = limit === null ? 100 : Math.min(limit, 100)

    // Build Facebook Graph API URL with filters
    let fbUrl = `https://graph.facebook.com/v22.0/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url&limit=${fetchLimit}&access_token=${pageAccessToken}`

    if (since) fbUrl += `&since=${since}`
    if (until) fbUrl += `&until=${until}`

    // Fetch all posts with pagination if no limit specified
    const allPosts: FacebookPost[] = []
    let currentUrl: string | null = fbUrl

    while (currentUrl) {
      const fbResponse = await fetch(currentUrl)

      if (!fbResponse.ok) {
        const errorText = await fbResponse.text()
        if (fbResponse.status === 401) {
          return NextResponse.json(
            { ...result, errors: ['Token Facebook invalide ou expire'] },
            { status: 401 }
          )
        }
        if (fbResponse.status === 429) {
          return NextResponse.json(
            { ...result, errors: ['Rate limit Facebook atteint. Reessayez plus tard.'] },
            { status: 429 }
          )
        }
        return NextResponse.json(
          { ...result, errors: [`Erreur API Facebook: ${errorText}`] },
          { status: fbResponse.status }
        )
      }

      const fbData: FacebookApiResponse = await fbResponse.json()

      if (fbData.error) {
        return NextResponse.json(
          { ...result, errors: [`Erreur Facebook: ${fbData.error.message}`] },
          { status: 400 }
        )
      }

      allPosts.push(...fbData.data)

      // If we have a limit and reached it, stop
      if (limit !== null && allPosts.length >= limit) {
        allPosts.splice(limit)
        break
      }

      // Continue pagination only if no limit
      currentUrl = limit === null ? (fbData.paging?.next || null) : null
    }

    // Find or create "Reportage" category
    if (cachedCategoryId === undefined) {
      try {
        let categoryResult = await payload.find({
          collection: 'categories',
          where: { title: { equals: 'Reportage' } },
          limit: 1,
        })

        if (categoryResult.docs.length === 0) {
          const newCategory = await payload.create({
            collection: 'categories',
            data: { title: 'Reportage', slug: 'reportage' },
            draft: false,
          })
          cachedCategoryId = newCategory.id
        } else {
          cachedCategoryId = categoryResult.docs[0].id
        }
      } catch {
        cachedCategoryId = null
      }
    }

    // Find the author "Stephane Sayeb" (with caching)
    if (cachedAuthorId === undefined) {
      try {
        let usersResult = await payload.find({
          collection: 'users',
          where: { name: { equals: 'Stephane Sayeb' } },
          limit: 1,
        })

        if (usersResult.docs.length === 0) {
          usersResult = await payload.find({
            collection: 'users',
            where: { email: { equals: 'contact@tahitizoom.pf' } },
            limit: 1,
          })
        }

        cachedAuthorId = usersResult.docs.length > 0 ? usersResult.docs[0].id : null
      } catch {
        cachedAuthorId = null
      }
    }

    const authorId = cachedAuthorId
    const categoryId = cachedCategoryId

    // Process each Facebook post
    for (const fbPost of allPosts) {
      try {
        // Check if post already exists by facebookId
        const existingPost = await payload.find({
          collection: 'posts',
          where: { facebookId: { equals: fbPost.id } },
          limit: 1,
        })

        if (existingPost.docs.length > 0) {
          result.skipped++
          continue
        }

        // Fetch all attachments (photos) for this post
        const allImageUrls = await fetchPostAttachments(fbPost.id, pageAccessToken)

        // Download and create media
        let coverMediaId: number | null = null
        const galleryMediaIds: number[] = []

        const coverUrl = fbPost.full_picture || allImageUrls[0]
        const additionalUrls = fbPost.full_picture
          ? allImageUrls.filter(url => url !== fbPost.full_picture)
          : allImageUrls.slice(1)

        if (coverUrl) {
          const imageData = await downloadImage(coverUrl)
          if (imageData) {
            try {
              const filename = `facebook-${fbPost.id}-cover.jpg`
              const mediaDoc = await payload.create({
                collection: 'media',
                data: { alt: fbPost.message?.slice(0, 100) || 'Image Facebook' },
                file: {
                  data: imageData.buffer,
                  mimetype: imageData.contentType,
                  name: filename,
                  size: imageData.buffer.length,
                },
              })
              coverMediaId = mediaDoc.id
            } catch (mediaError) {
              result.errors.push(`Erreur upload image pour ${fbPost.id}: ${mediaError instanceof Error ? mediaError.message : 'Erreur inconnue'}`)
            }
          }
        }

        // Download additional images
        for (let imgIdx = 0; imgIdx < additionalUrls.length; imgIdx++) {
          const imgUrl = additionalUrls[imgIdx]
          try {
            const imageData = await downloadImage(imgUrl)
            if (imageData) {
              const filename = `facebook-${fbPost.id}-${imgIdx + 1}.jpg`
              const mediaDoc = await payload.create({
                collection: 'media',
                data: { alt: `${fbPost.message?.slice(0, 50) || 'Image Facebook'} - ${imgIdx + 2}` },
                file: {
                  data: imageData.buffer,
                  mimetype: imageData.contentType,
                  name: filename,
                  size: imageData.buffer.length,
                },
              })
              galleryMediaIds.push(mediaDoc.id)
            }
          } catch {
            // Skip this image
          }
        }

        // Generate title from message
        const message = fbPost.message || ''
        const title = message.length > 0
          ? message.slice(0, 80) + (message.length > 80 ? '...' : '')
          : 'Post Facebook'

        // Create the post
        const postData: Record<string, unknown> = {
          title,
          content: message
            ? createLexicalContent(message, galleryMediaIds)
            : createLexicalContent('', galleryMediaIds),
          facebookUrl: fbPost.permalink_url,
          facebookId: fbPost.id,
          publishedAt: fbPost.created_time,
          _status: 'published',
          meta: {
            title: `${title} | Tahiti Zoom — Stephane Sayeb`,
          },
        }

        if (coverMediaId) {
          postData.coverImage = coverMediaId
        }

        if (authorId) {
          postData.authors = [authorId]
        }

        if (categoryId) {
          postData.categories = [categoryId]
        }

        await payload.create({
          collection: 'posts',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: postData as any,
          draft: false,
        })

        result.imported++
      } catch (postError) {
        result.errors.push(`Erreur creation post ${fbPost.id}: ${postError instanceof Error ? postError.message : 'Erreur inconnue'}`)
      }
    }

    result.success = true
    return NextResponse.json(result)
  } catch (error) {
    result.errors.push(`Erreur generale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    return NextResponse.json(result, { status: 500 })
  }
}
