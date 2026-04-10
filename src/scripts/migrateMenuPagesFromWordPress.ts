import config from '../payload.config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../..')

type LocaleCode = 'fr' | 'en' | 'ja'
type HtmlBlock = { tag: string; text: string }
type LexicalNode = {
  type: string
  version: number
  [key: string]: unknown
}

const pageSourceMap: Record<
  string,
  {
    titles: Record<LocaleCode, string>
    sources: Record<LocaleCode, string[]>
  }
> = {
  'centre-culturel': {
    titles: {
      fr: 'Le Centre Culturel',
      en: 'The Cultural Center',
      ja: '文化センター',
    },
    sources: {
      fr: ['le-centre-culturel'],
      en: ['the-cultural-center'],
      ja: ['%e6%96%87%e5%8c%96%e3%82%bb%e3%83%b3%e3%82%bf%e3%83%bc'],
    },
  },
  'show-polynesien': {
    titles: {
      fr: 'Le Show Polynésien',
      en: 'The Polynesian Show',
      ja: 'ポリネシアンショー',
    },
    sources: {
      fr: ['le-show-polynesien-2'],
      en: ['the-polynesian-show'],
      ja: ['%e3%83%9d%e3%83%aa%e3%83%8d%e3%82%b7%e3%82%a2%e3%83%b3%e3%82%b7%e3%83%a7%e3%83%bc'],
    },
  },
  mariages: {
    titles: {
      fr: 'Les Mariages',
      en: 'Weddings',
      ja: '結婚式',
    },
    sources: {
      fr: ['les-mariages-2'],
      en: ['weddings-and-vow-renewals'],
      ja: ['%e7%b5%90%e5%a9%9a%e5%bc%8f', '%e3%82%a6%e3%82%a7%e3%83%87%e3%82%a3%e3%83%b3%e3%82%b0'],
    },
  },
  reservations: {
    titles: {
      fr: 'Réservations',
      en: 'Booking',
      ja: '予約',
    },
    sources: {
      fr: ['reservation'],
      en: ['booking'],
      ja: ['%e4%ba%88%e7%b4%84'],
    },
  },
  contact: {
    titles: {
      fr: 'Contact',
      en: 'Contact Us',
      ja: 'お問い合わせ',
    },
    sources: {
      fr: ['61267', 'contact-us', '36273'],
      en: ['contact-us', '36273'],
      ja: ['%e3%81%8a%e5%95%8f%e3%81%84%e5%90%88%e3%82%8f%e3%81%9b'],
    },
  },
}

const richTextRoot = (children: LexicalNode[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const paragraphNode = (text: string) => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const headingNode = (text: string, tag: 'h1' | 'h2' | 'h3' | 'h4') => ({
  type: 'heading',
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

function decodeHtml(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&eacute;/g, 'e')
}

function stripHtml(text: string): string {
  return decodeHtml(text)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractBlocks(html: string): HtmlBlock[] {
  const matches = html.matchAll(/<(h[1-6]|p|li)[^>]*>([\s\S]*?)<\/\1>/gi)
  const blocks: HtmlBlock[] = []

  for (const match of matches) {
    const tag = match[1].toLowerCase()
    const text = stripHtml(match[2])

    if (!text) continue

    blocks.push({
      tag,
      text: tag === 'li' ? `• ${text}` : text,
    })
  }

  return blocks
}

function toHeroRichText(blocks: HtmlBlock[], title: string) {
  const smallHeading = blocks.find((block) => ['h6', 'h5', 'h4', 'h3'].includes(block.tag))
  const mainHeading = blocks.find((block) => ['h1', 'h2', 'h3'].includes(block.tag))
  const firstParagraph = blocks.find((block) => block.tag === 'p')

  const children: LexicalNode[] = []

  if (smallHeading && smallHeading.text !== mainHeading?.text) {
    children.push(headingNode(smallHeading.text, 'h2'))
  }

  children.push(headingNode(mainHeading?.text || title, 'h1'))

  if (firstParagraph) {
    children.push(paragraphNode(firstParagraph.text))
  }

  return richTextRoot(children)
}

function toBodyRichText(blocks: HtmlBlock[]) {
  const bodyNodes = blocks
    .slice(1)
    .map((block) => {
      if (block.tag === 'h2') return headingNode(block.text, 'h2')
      if (block.tag === 'h3') return headingNode(block.text, 'h3')
      if (['h4', 'h5', 'h6'].includes(block.tag)) return headingNode(block.text, 'h4')
      return paragraphNode(block.text)
    })
    .slice(0, 24)

  return richTextRoot(bodyNodes.length > 0 ? bodyNodes : [paragraphNode('Contenu en cours de migration.')])
}

function buildPageData(title: string, blocks: HtmlBlock[]): RequiredDataFromCollectionSlug<'pages'> {
  const description =
    blocks.find((block) => block.tag === 'p')?.text.slice(0, 160) ||
    `${title} - contenu en cours de migration depuis le site source.`

  return {
    title,
    slug: 'temporary-overridden-later',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: toHeroRichText(blocks, title),
      links: [],
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: toBodyRichText(blocks),
          },
        ],
      },
    ],
    meta: {
      title,
      description,
    },
  }
}

async function readWordPressItems() {
  const xmlPath = path.join(
    projectRoot,
    'docs/migration-source/02-content/tikivillage.WordPress.Pages.2026-04-09.xml',
  )
  const xml = await fs.readFile(xmlPath, 'utf8')
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1])

  return items.map((item) => {
    const read = (pattern: RegExp) => pattern.exec(item)?.[1]?.trim() || ''

    return {
      postId: read(/<wp:post_id>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:post_id>/),
      title: stripHtml(read(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)),
      slug: read(/<wp:post_name>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:post_name>/),
      postType: read(/<wp:post_type>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:post_type>/),
      content: read(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/),
    }
  })
}

async function main() {
  const payload = await getPayload({ config })
  const wordpressItems = (await readWordPressItems()).filter((item) => item.postType === 'page')

  const bySource = new Map<string, (typeof wordpressItems)[number]>()
  for (const item of wordpressItems) {
    bySource.set(item.slug, item)
    bySource.set(item.postId, item)
  }

  for (const [targetSlug, configEntry] of Object.entries(pageSourceMap)) {
    const frSource = configEntry.sources.fr
      .map((key) => bySource.get(key))
      .find(Boolean)

    if (!frSource) {
      console.warn(`Source FR introuvable pour ${targetSlug}`)
      continue
    }

    const frBlocks = extractBlocks(frSource.content)
    const frData = buildPageData(configEntry.titles.fr, frBlocks)
    frData.slug = targetSlug

    const existing = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      locale: 'fr',
      pagination: false,
      where: {
        slug: {
          equals: targetSlug,
        },
      },
    })

    let pageId: number

    if (existing.docs[0]) {
      pageId = existing.docs[0].id
      await payload.update({
        collection: 'pages',
        id: pageId,
        locale: 'fr',
        data: frData,
        context: {
          disableRevalidate: true,
        },
      })
    } else {
      const created = await payload.create({
        collection: 'pages',
        locale: 'fr',
        data: frData,
        context: {
          disableRevalidate: true,
        },
      })
      pageId = created.id
    }

    for (const locale of ['en', 'ja'] as const) {
      const source = configEntry.sources[locale]
        .map((key) => bySource.get(key))
        .find(Boolean)

      if (!source) {
        console.warn(`Source ${locale} introuvable pour ${targetSlug}`)
        continue
      }

      const blocks = extractBlocks(source.content)
      const localizedData = buildPageData(configEntry.titles[locale], blocks)
      localizedData.slug = targetSlug

      await payload.update({
        collection: 'pages',
        id: pageId,
        locale,
        data: localizedData,
        context: {
          disableRevalidate: true,
        },
      })
    }

    console.log(`Page de menu migree: ${targetSlug}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
