import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Centre culturel polynésien à Moorea, spectacles, mariages et expériences culturelles.',
  images: [
    {
      url: `${getServerSideURL()}/images/hero-bg.webp`,
    },
  ],
  siteName: 'Tiki Village',
  title: 'Tiki Village',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
