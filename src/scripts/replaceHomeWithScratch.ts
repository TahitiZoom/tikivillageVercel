import config from '../payload.config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type File, type RequiredDataFromCollectionSlug } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../..')

type LexicalNode = {
  [key: string]: unknown
  type: string
  version: number
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

const headingNode = (text: string, tag: 'h1' | 'h2' | 'h3' | 'h4') => ({
  type: 'heading',
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
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

const mimeTypeByExt: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

async function getLocalFile(relativePath: string): Promise<File> {
  const absolutePath = path.join(projectRoot, relativePath)
  const data = await fs.readFile(absolutePath)
  const ext = path.extname(absolutePath).toLowerCase()

  return {
    name: path.basename(absolutePath),
    data,
    mimetype: mimeTypeByExt[ext] || 'application/octet-stream',
    size: data.byteLength,
  }
}

async function ensureMedia(relativePath: string, alt: string) {
  const payload = await getPayload({ config })
  const filename = path.basename(relativePath)

  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      filename: {
        equals: filename,
      },
    },
  })

  if (existing.docs[0]) {
    return existing.docs[0]
  }

  return payload.create({
    collection: 'media',
    data: { alt },
    file: await getLocalFile(relativePath),
  })
}

async function main() {
  const payload = await getPayload({ config })

  const homePageResult = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  const homePage = homePageResult.docs[0]

  if (!homePage) {
    throw new Error('Page home introuvable dans Payload.')
  }

  const heroMedia = await ensureMedia('public/images/hero-bg.webp', 'Hero Tiki Village Moorea')
  const show1 = await ensureMedia('public/images/show-1.jpg', 'Show polynesien 1')
  const show2 = await ensureMedia('public/images/show-2.jpg', 'Show polynesien 2')
  const show3 = await ensureMedia('public/images/show-3.jpg', 'Show polynesien 3')
  const atelier = await ensureMedia('public/images/atelier.jpg', 'Atelier culturel')
  const village = await ensureMedia('public/images/village.jpg', 'Village culturel')
  const tikiVillage2 = await ensureMedia('public/images/tiki-village-2.jpg', 'Tiki Village')
  const show4 = await ensureMedia('public/images/show-4.jpg', 'Show polynesien 4')
  const soiree = await ensureMedia('public/images/soiree.jpg', 'Soiree polynesienne')
  const contactBg = await ensureMedia('public/images/contact-bg.webp', 'Contact Tiki Village')

  const homeData: RequiredDataFromCollectionSlug<'pages'> = {
    title: 'Home',
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'highImpact',
      media: heroMedia.id,
      richText: richTextRoot([
        headingNode('La visite incontournable #1 de Polynésie', 'h2'),
        headingNode('TIKI VILLAGE', 'h1'),
        paragraphNode('DÉCOUVREZ L’UNIQUE ET AUTHENTIQUE PATRIMOINE CULTUREL POLYNÉSIEN'),
      ]),
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'RÉSERVER',
            newTab: false,
            url: '/reservations',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'NOUS CONTACTER',
            newTab: false,
            url: '/contact',
          },
        },
      ],
    },
    meta: {
      title: 'Tiki Village',
      description:
        'Centre culturel polynésien à Moorea, avec show, artisanat, mariages traditionnels et expériences inoubliables.',
      image: heroMedia.id,
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'half',
            enableLink: true,
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'EN SAVOIR PLUS',
              newTab: false,
              url: '/centre-culturel',
            },
            richText: richTextRoot([
              headingNode(
                "Visitez les « Fare » traditionnels et artisanat local, venez vous faire tatouer ou visiter la galerie Gauguin et le Fare Sylvain avec ses photos du Tahiti d'antan.",
                'h2',
              ),
            ]),
          },
          {
            size: 'half',
            enableLink: false,
            richText: richTextRoot([
              paragraphNode(
                "Bienvenue au Tiki Village, reconstitution d'un village polynésien d'antan avec son Marae, lieu de culte traditionnel. Vous pourrez y découvrir la culture polynésienne d'aujourd'hui et d'autrefois dans un cadre exceptionnel au cœur de l'île de Moorea.",
              ),
              paragraphNode(
                "Le restaurant « La Tiki » est de loin le meilleur de la région, il vous sera possible du mardi au samedi de déguster les spécialités tahitiennes. Une visite culturelle pour toute la famille.",
              ),
            ]),
          },
        ],
      },
      { blockType: 'mediaBlock', media: show1.id },
      { blockType: 'mediaBlock', media: show2.id },
      { blockType: 'mediaBlock', media: show3.id },
      { blockType: 'mediaBlock', media: atelier.id },
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: richTextRoot([
              headingNode('LE CENTRE CULTUREL', 'h2'),
              headingNode('Visitez le fameux centre culturel du Village de Moorea.', 'h3'),
              paragraphNode(
                "C'est en 1983 que le Tiki Village a vu le jour, sur l'initiative d'Olivier Briac, homme de théâtre reconnu, passionné de culture polynésienne. Après avoir parcouru le monde entier, il décide de créer un lieu unique dédié à la transmission de la culture de ses ancêtres.",
              ),
              paragraphNode(
                "Aujourd'hui, le Tiki Village de Moorea est reconnu comme l'un des hauts lieux de la culture polynésienne et parmi les incontournables de la Polynésie française.",
              ),
            ]),
          },
          {
            size: 'full',
            enableLink: true,
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'DÉCOUVRIR',
              newTab: false,
              url: '/centre-culturel',
            },
            richText: richTextRoot([]),
          },
        ],
      },
      { blockType: 'mediaBlock', media: village.id },
      { blockType: 'mediaBlock', media: tikiVillage2.id },
      { blockType: 'mediaBlock', media: show4.id },
      { blockType: 'mediaBlock', media: soiree.id },
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: richTextRoot([
              headingNode('LA SOIRÉE POLYNÉSIENNE', 'h2'),
              headingNode('Pourquoi est-ce la visite inoubliable ?', 'h3'),
              paragraphNode(
                '01. Une Qualité De Services Abordables. Gentillesse, Partage et Passion font la fierté du Tiki Village.',
              ),
              paragraphNode(
                "02. Mariages Traditionnels Sur Commande. Pleine de douceur et d'authenticité, exceptionnel et modernisé polynésiens.",
              ),
              paragraphNode(
                "03. Une Équipe Adorable Et Compétente. La passion que notre équipe vous transmet vous donnera envie de revenir !",
              ),
            ]),
          },
        ],
      },
      {
        blockType: 'cta',
        richText: richTextRoot([
          headingNode(
            'Peuple à la légendaire gentillesse, visites inoubliables, Moorea comme vous en rêviez !',
            'h2',
          ),
        ]),
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'RÉSERVER',
              newTab: false,
              url: '/reservations',
            },
          },
        ],
      },
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            enableLink: false,
            richText: richTextRoot([
              headingNode('TÉMOIGNAGES', 'h2'),
              paragraphNode(
                '"Quelle fantastique visite ! À partir du moment où nous avons débuté la visite, nous avons rencontré des gens attachants et toujours disponibles, vraiment compétents et d’une gentillesse incroyable ! Réservez vite !"',
              ),
              paragraphNode('Stéphane & Victoire — TripAdvisor — ★★★★★'),
            ]),
          },
        ],
      },
      {
        blockType: 'cta',
        richText: richTextRoot([
          headingNode('Souscrivez à notre newsletter', 'h2'),
          headingNode('LES COULISSES', 'h3'),
          paragraphNode(
            'Recevez nos actualités, les coulisses du village et les prochaines expériences à vivre à Moorea.',
          ),
        ]),
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'CONTACTEZ-NOUS',
              newTab: false,
              url: '/contact',
            },
          },
        ],
      },
      { blockType: 'mediaBlock', media: contactBg.id },
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            enableLink: true,
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'NOUS CONTACTER',
              newTab: false,
              url: '/contact',
            },
            richText: richTextRoot([
              headingNode("N'hésitez pas à nous contacter pour plus d'informations.", 'h2'),
              paragraphNode(
                'Notre équipe est disponible du mardi au samedi pour répondre à toutes vos questions sur nos prestations.',
              ),
              paragraphNode('Moorea, Polynésie française'),
              paragraphNode('+689 40 550 250'),
              paragraphNode('accueil@tikivillage.pf'),
            ]),
          },
        ],
      },
    ],
  }

  await payload.update({
    collection: 'pages',
    id: homePage.id,
    locale: 'fr',
    context: {
      disableRevalidate: true,
    },
    data: homeData,
  })

  console.log(`Home page ${homePage.id} mise à jour avec le contenu from scratch.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
