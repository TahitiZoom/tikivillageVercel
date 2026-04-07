import { getPayload } from 'payload'
import config from '@payload-config'

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

export interface SyncResult {
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

type ProgressMessage =
  | { type: 'start'; total: number; message: string }
  | { type: 'info'; message: string }
  | {
      type: 'progress'
      current: number
      total: number
      post: string
      status: 'skipped' | 'importing' | 'importing_image' | 'imported' | 'error'
      message: string
    }
  | { type: 'complete'; imported: number; skipped: number; errors: number; message: string }

type SyncOptions = {
  limit?: number | null
  since?: number
  until?: number
  onMessage?: (message: ProgressMessage) => void
}

// Cache for author ID and category ID to avoid repeated queries
let cachedAuthorId: number | null | undefined = undefined
let cachedCategoryId: number | null | undefined = undefined

function createLexicalContent(text: string, galleryMediaIds?: number[]): object {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim())

  paragraphs.push('✍ Stephane Sayeb')

  const children: object[] = paragraphs.map((paragraph) => ({
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

export function parseSyncParamsFromURL(urlString: string): {
  limit: number | null
  since?: number
  until?: number
} {
  const url = new URL(urlString)
  const searchParams = url.searchParams

  const limitStr = searchParams.get('limit')
  let limit: number | null = null

  if (limitStr && limitStr.trim() !== '') {
    const parsed = parseInt(limitStr, 10)
    if (!isNaN(parsed) && parsed > 0) {
      limit = Math.min(parsed, 100)
    }
  }

  const sinceStr = searchParams.get('since')
  let since: number | undefined
  if (sinceStr) {
    const sinceDate = new Date(sinceStr)
    if (!isNaN(sinceDate.getTime())) {
      since = Math.floor(sinceDate.getTime() / 1000)
    }
  }

  const untilStr = searchParams.get('until')
  let until: number | undefined
  if (untilStr) {
    const untilDate = new Date(untilStr)
    if (!isNaN(untilDate.getTime())) {
      untilDate.setHours(23, 59, 59, 999)
      until = Math.floor(untilDate.getTime() / 1000)
    }
  }

  if (limit === null && !since && !until) {
    limit = 10
  }

  return { limit, since, until }
}

export async function syncFacebook(options: SyncOptions = {}): Promise<SyncResult> {
  const payload = await getPayload({ config })
  const onMessage = options.onMessage

  const send = (message: ProgressMessage) => {
    onMessage?.(message)
  }

  const result: SyncResult = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: [],
  }

  const pageAccessToken =
    process.env.FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  const pageId = process.env.FB_PAGE_ID || process.env.FACEBOOK_PAGE_ID

  if (!pageAccessToken || !pageId) {
    result.errors.push('Variables Facebook manquantes (FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID)')
    return result
  }

  const limit = options.limit ?? 10
  const since = options.since
  const until = options.until
  const fetchLimit = limit === null ? 100 : Math.min(limit, 100)

  let fbUrl = `https://graph.facebook.com/v22.0/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url&limit=${fetchLimit}&access_token=${pageAccessToken}`

  if (since) fbUrl += `&since=${since}`
  if (until) fbUrl += `&until=${until}`

  send({ type: 'start', total: limit || 0, message: 'Connexion a Facebook...' })

  const allPosts: FacebookPost[] = []
  let currentUrl: string | null = fbUrl
  let pageNum = 0

  while (currentUrl) {
    const fbResponse = await fetch(currentUrl)

    if (!fbResponse.ok) {
      const errorText = await fbResponse.text()
      if (fbResponse.status === 401) {
        result.errors.push('Token Facebook invalide ou expire')
      } else if (fbResponse.status === 429) {
        result.errors.push('Rate limit Facebook atteint. Reessayez plus tard.')
      } else {
        result.errors.push(`Erreur API Facebook: ${errorText.slice(0, 300)}`)
      }
      return result
    }

    const fbData: FacebookApiResponse = await fbResponse.json()

    if (fbData.error) {
      result.errors.push(`Erreur Facebook: ${fbData.error.message}`)
      return result
    }

    allPosts.push(...fbData.data)
    pageNum++

    if (limit === null && fbData.paging?.next) {
      send({ type: 'info', message: `Page ${pageNum} : ${allPosts.length} posts recuperes...` })
    }

    if (limit !== null && allPosts.length >= limit) {
      allPosts.splice(limit)
      break
    }

    currentUrl = limit === null ? (fbData.paging?.next || null) : null
  }

  const total = allPosts.length
  send({
    type: 'start',
    total,
    message: `${total} posts trouves. Debut de la synchronisation...`,
  })

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
        send({ type: 'info', message: 'Categorie "Reportage" creee' })
      } else {
        cachedCategoryId = categoryResult.docs[0].id
      }
    } catch {
      cachedCategoryId = null
    }
  }

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

  for (let i = 0; i < allPosts.length; i++) {
    const fbPost = allPosts[i]
    const current = i + 1
    const postTitle = fbPost.message?.slice(0, 50) || 'Post Facebook'

    try {
      const existingPost = await payload.find({
        collection: 'posts',
        where: { facebookId: { equals: fbPost.id } },
        limit: 1,
      })

      if (existingPost.docs.length > 0) {
        result.skipped++
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

      const allImageUrls = await fetchPostAttachments(fbPost.id, pageAccessToken)

      let coverMediaId: number | null = null
      const galleryMediaIds: number[] = []

      const coverUrl = fbPost.full_picture || allImageUrls[0]
      const additionalUrls = fbPost.full_picture
        ? allImageUrls.filter((url) => url !== fbPost.full_picture)
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
            result.errors.push(
              `Erreur upload image couverture pour ${fbPost.id}: ${
                mediaError instanceof Error ? mediaError.message : 'Erreur inconnue'
              }`,
            )
          }
        }
      }

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
                data: {
                  alt: `${fbPost.message?.slice(0, 50) || 'Image Facebook'} - ${imgIdx + 2}`,
                },
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
            // skip image
          }
        }
      }

      const message = fbPost.message || ''
      const title =
        message.length > 0
          ? message.slice(0, 80) + (message.length > 80 ? '...' : '')
          : 'Post Facebook'

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
      result.errors.push(
        `Erreur creation post ${fbPost.id}: ${
          postError instanceof Error ? postError.message : 'Erreur inconnue'
        }`,
      )
      send({
        type: 'progress',
        current,
        total,
        post: postTitle,
        status: 'error',
        message: `${current}/${total} - Erreur : ${postTitle} - ${
          postError instanceof Error ? postError.message : 'Erreur inconnue'
        }`,
      })
    }
  }

  result.success = true

  send({
    type: 'complete',
    imported: result.imported,
    skipped: result.skipped,
    errors: result.errors.length,
    message: `Termine : ${result.imported} importes, ${result.skipped} ignores, ${result.errors.length} erreurs`,
  })

  return result
}
