import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, coverImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="flex flex-col">
      {/* Cover Image - Full display without cropping */}
      {coverImage && typeof coverImage !== 'string' && (
        <div
          className="w-full flex items-center justify-center"
          style={{ backgroundColor: '#f5f5f5' }}
        >
          <Media
            priority
            imgClassName="w-full h-auto max-h-[80vh] object-contain"
            resource={coverImage}
          />
        </div>
      )}

      {/* Content below image */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="uppercase text-sm mb-4 text-gray-500">
              {categories.map((category, index) => {
                if (typeof category === 'object' && category !== null) {
                  const { title: categoryTitle } = category
                  const titleToUse = categoryTitle || 'Untitled category'
                  const isLast = index === categories.length - 1

                  return (
                    <React.Fragment key={index}>
                      {titleToUse}
                      {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                    </React.Fragment>
                  )
                }
                return null
              })}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl text-gray-900">{title}</h1>

          {/* Meta info */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-16 text-gray-600">
            {hasAuthors && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-400">Auteur</p>
                <p>{formatAuthors(populatedAuthors)}</p>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-400">Date de publication</p>
                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
