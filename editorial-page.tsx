'use client'
import Link from 'next/link'
import { useLocale } from '@/components/LocaleProvider'
import { useEffect, useState } from 'react'

const POSTS_PER_PAGE = 20

export default function EditorialPage() {
  const { t } = useLocale()
  const [posts, setPosts] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  // ─── Filtre par année ─────────────────────────────────────────
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null) // null = "Toutes"

  // Charger les années disponibles au montage
  useEffect(() => {
    fetch(`/api/posts?limit=0&where[_status][equals]=published&sort=-publishedAt`)
      .then(r => r.json())
      .then(d => {
        const docs = d.docs || []
        const years = new Set<number>()
        docs.forEach((post: any) => {
          if (post.publishedAt) {
            years.add(new Date(post.publishedAt).getFullYear())
          }
        })
        const sorted = Array.from(years).sort((a, b) => b - a)
        setAvailableYears(sorted)
      })
      .catch(() => {})
  }, [])

  // Charger les posts (avec filtre année si sélectionné)
  useEffect(() => {
    setLoading(true)

    let url = `/api/posts?limit=${POSTS_PER_PAGE}&page=${currentPage}&where[_status][equals]=published&sort=-publishedAt`

    if (selectedYear !== null) {
      const start = `${selectedYear}-01-01T00:00:00.000Z`
      const end = `${selectedYear}-12-31T23:59:59.999Z`
      url += `&where[publishedAt][greater_than_equal]=${start}&where[publishedAt][less_than_equal]=${end}`
    }

    fetch(url)
      .then(r => r.json())
      .then(d => {
        setPosts(d.docs || [])
        setTotalPages(d.totalPages || 1)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [currentPage, selectedYear])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const selectYear = (year: number | null) => {
    setSelectedYear(year)
    setCurrentPage(1) // Reset à la page 1 quand on change de filtre
  }

  return (
    <div style={{ background: 'white', color: '#111', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase text-black/40 mb-4">{t('editorial.subtitle')}</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-black">{t('editorial.title')}</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: '#777',
            maxWidth: '600px', lineHeight: '1.8', marginTop: '1.5rem' }}>
            {t('editorial.description')}
          </p>
        </div>

        {/* ─── Filtre par année ─────────────────────────────────── */}
        {availableYears.length > 1 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <button
              onClick={() => selectYear(null)}
              className="px-4 py-1.5 text-sm tracking-wide transition-all duration-200"
              style={{
                background: selectedYear === null ? '#111' : 'transparent',
                color: selectedYear === null ? '#fff' : '#999',
                border: selectedYear === null ? '1px solid #111' : '1px solid #ddd',
              }}
            >
              {t('editorial.filterAll') || 'Toutes'}
            </button>
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => selectYear(year)}
                className="px-4 py-1.5 text-sm tracking-wide transition-all duration-200"
                style={{
                  background: selectedYear === year ? '#111' : 'transparent',
                  color: selectedYear === year ? '#fff' : '#999',
                  border: selectedYear === year ? '1px solid #111' : '1px solid #ddd',
                }}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-32">
            <p className="text-black/40 text-xl">Chargement...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
              {posts.map((post: any) => {
                const img = post.coverImage?.url || null
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric', month: 'long', day: 'numeric' })
                  : null
                return (
                  <Link key={post.id} href={`/posts/${post.slug}`}
                    className="group block break-inside-avoid mb-4 relative overflow-hidden bg-black/5">
                    {img && <img src={img} alt={post.title}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      {date && <p className="text-xs text-white/60 tracking-widest mb-1">{date}</p>}
                      <h2 className="text-base font-light text-white">{post.title}</h2>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Premiere
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Precedent
                </button>

                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Suivant
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Derniere
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-32">
            <p className="text-black/20 text-3xl font-light">
              {selectedYear
                ? `${t('editorial.noPostsYear') || 'Aucun article en'} ${selectedYear}`
                : (t('editorial.noPosts') || 'Aucun article')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
