import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc?.sizes?.thumbnail?.url) {
          doc.thumbnailURL = doc.sizes.thumbnail.url
        }

        if (doc?.sizes?.thumbnail?.filename && doc?.sizes?.thumbnail?.url) {
          doc.thumbnail_u_r_l = doc.sizes.thumbnail.url
        }

        if (doc?.url && typeof doc.url === 'string' && doc.url.startsWith('/api/media/file/')) {
          if (doc.filename && process.env.S3_PUBLIC_URL) {
            const base = process.env.S3_PUBLIC_URL.replace(/\/$/, '')
            const prefix = doc.prefix ? `${doc.prefix}/` : ''
            doc.url = `${base}/${prefix}${doc.filename}`
          }
        }

        return doc
      },
    ],
  },
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // Conversion automatique en WebP pour tous les nouveaux uploads
    formatOptions: {
      format: 'webp',
      options: {
        quality: 85,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'small',
        width: 600,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
    ],
  },
}
