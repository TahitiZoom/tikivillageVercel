'use client'
import { useState } from 'react'

interface MasonryGalleryProps {
  images: Array<{
    id: number
    url?: string
    alt?: string
    width?: number
    height?: number
    sizes?: {
      medium?: { url?: string | null }
      small?: { url?: string | null }
    }
  }>
}

export function MasonryGallery({ images }: MasonryGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  // Get the best thumbnail URL for masonry grid
  const getThumbnailUrl = (img: MasonryGalleryProps['images'][0]) => {
    return img.sizes?.medium?.url || img.sizes?.small?.url || img.url
  }

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="break-inside-avoid cursor-pointer group mb-3"
            onClick={() => setLightboxIndex(index)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={getThumbnailUrl(img) || ''}
                alt={img.alt || ''}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl z-10"
            onClick={() => setLightboxIndex(null)}
          >
            &times;
          </button>

          {/* Navigation */}
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex - 1)
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {lightboxIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex + 1)
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || ''}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
