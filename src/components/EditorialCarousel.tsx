'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function EditorialCarousel({ posts }: { posts: any[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | null>(null)
  const posRef = useRef(0)
  const speedRef = useRef(0.5)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += speedRef.current
        const half = track.scrollWidth / 2
        if (posRef.current >= half) posRef.current = 0
        track.style.transform = `translateX(-${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current!)
  }, [posts])

  const doubled = [...posts, ...posts]

  return (
    <div
      className="w-full overflow-hidden"
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
        setActiveIndex(null)
      }}
    >
      <div ref={trackRef} className="flex" style={{ willChange: 'transform' }}>
        {doubled.map((post, i) => {
          const img =
            post.coverImage?.sizes?.medium?.url ||
            post.coverImage?.sizes?.small?.url ||
            post.coverImage?.sizes?.thumbnail?.url ||
            post.coverImage?.url ||
            null

          const idx = i % posts.length
          const isActive = activeIndex === i

          return (
            <Link
              key={`${post.id}-${i}`}
              href={`/posts/${post.slug}`}
              onMouseEnter={() => setActiveIndex(i)}
              className="relative flex-shrink-0 overflow-hidden group"
              style={{
                width: isActive ? '340px' : '200px',
                height: '480px',
                transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {img ? (
                <Image
                  src={img}
                  alt={post.title}
                  fill
                  priority={i == 0}
                  sizes="(max-width: 768px) 200px, 200px"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                  <span className="text-white/20 text-4xl font-light">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              )}

              <div
                className="absolute inset-0"
                style={{
                  background: isActive
                    ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)'
                    : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
                  transition: 'background 0.4s',
                }}
              />

              <div
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <p className="text-xs tracking-widest uppercase text-white/50 mb-1">
                  /{String(idx + 1).padStart(2, '0')}
                </p>
                <h3 className="text-base font-light text-white leading-snug mb-2">{post.title}</h3>
                <span className="text-xs tracking-widest uppercase text-white/60 flex items-center gap-1">
                  Lire
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M7 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              {!isActive && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-xs text-white/40 tracking-widest">
                    /{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
