import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Media as MediaType, Page, Post } from '@/payload-types'

type Props = {
  page: Page
}

const POSTS_QUERY_TIMEOUT_MS = 5000
const DOSIS_FONT = 'var(--font-dosis), sans-serif'
const HOME_TITLE_CLASS =
  "[&_h2]:font-[var(--font-dosis)] [&_h2]:text-[30px] [&_h2]:font-[400] [&_h2]:uppercase [&_h2]:leading-[1.08] [&_h2]:tracking-[0.01em] [&_h2]:text-[var(--e-global-color-primary)] [&_h3]:font-[var(--font-dosis)] [&_h3]:text-[30px] [&_h3]:font-[400] [&_h3]:uppercase [&_h3]:leading-[1.08] [&_h3]:tracking-[0.01em] [&_h3]:text-[var(--e-global-color-primary)]"
const HOME_BODY_CLASS =
  "[&_p]:font-[var(--font-dosis)] [&_p]:text-[25px] [&_p]:font-[300] [&_p]:leading-[1.45] [&_p]:tracking-[-0.01em] [&_p]:text-[#2e575d]"

const sectionStyles = {
  shell: {
    maxWidth: '1420px',
    margin: '0 auto',
    padding: '0 3rem',
  } satisfies React.CSSProperties,
  section: {
    background: 'white',
    padding: '4.5rem 0',
  } satisfies React.CSSProperties,
}

const pourquoiCards = [
  {
    number: '01',
    title: 'Une Qualité De Services Abordables',
    text: 'Spectacles, Restauration, Ateliers, Mariages Traditionnels à la portée de toutes les bourses !',
  },
  {
    number: '02',
    title: 'Mariages Traditionnels Sur Commande',
    text: 'Mariez vous dans la plus authentique et inoubliable tradition polynésienne.',
  },
  {
    number: '03',
    title: 'Une Équipe Adorable Et Compétente',
    text: 'La légendaire gentillesse des polynésiens est universellement connue. Venez donc y goûter !',
  },
]

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        reject(new Error(`Posts query timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    }),
  ])
}

const getMediaFromBlock = (block: Page['layout'][number] | undefined): MediaType | null => {
  if (!block || block.blockType !== 'mediaBlock') return null
  return typeof block.media === 'object' && block.media ? block.media : null
}

const getContentBlock = (block: Page['layout'][number] | undefined) => {
  if (!block || block.blockType !== 'content') return null
  return block
}

const getCtaBlock = (block: Page['layout'][number] | undefined) => {
  if (!block || block.blockType !== 'cta') return null
  return block
}

const getPostImage = (post: Post): MediaType | null => {
  const source = typeof post.heroImage === 'object' && post.heroImage ? post.heroImage : post.meta?.image
  return typeof source === 'object' && source ? source : null
}

const formatPostDate = (date?: string | null) => {
  if (!date) return null

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

const FriezeBand = ({ width = 520 }: { width?: number }) => {
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: `${width}px`,
        height: '34px',
        marginBottom: '1.6rem',
      }}
    >
      <img
        src="/images/bg-frise-blanc-horiz-v3-1280.webp"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.2,
        }}
      />
      <img
        src="/images/bg-frise-horiz-v2-1280.svg"
        alt=""
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: '240px',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  )
}

export async function HomePageContent({ page }: Props) {
  const introBlock = getContentBlock(page.layout[0])
  const galleryMedia = [page.layout[1], page.layout[2], page.layout[3], page.layout[4]]
    .map(getMediaFromBlock)
    .filter(Boolean) as MediaType[]
  const cultureBlock = getContentBlock(page.layout[5])
  const cultureMedia = [page.layout[6], page.layout[7], page.layout[8]]
    .map(getMediaFromBlock)
    .filter(Boolean) as MediaType[]
  const soireeMedia = getMediaFromBlock(page.layout[9])
  const reasonsBlock = getContentBlock(page.layout[10])
  const ctaBanner = getCtaBlock(page.layout[11])
  const testimonialsBlock = getContentBlock(page.layout[12])
  const newsletterBlock = getCtaBlock(page.layout[13])
  const contactMedia = getMediaFromBlock(page.layout[14])
  const contactBlock = getContentBlock(page.layout[15])

  const allThumbnails = [...galleryMedia.slice(2), ...cultureMedia]

  let latestPosts: { docs: Post[] } = { docs: [] }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await withTimeout(
      payload.find({
        collection: 'posts',
        depth: 1,
        limit: 2,
        sort: '-publishedAt',
        pagination: false,
      }),
      POSTS_QUERY_TIMEOUT_MS,
    )

    latestPosts = { docs: result.docs as Post[] }
  } catch (error) {
    console.error('[HomePageContent] Failed to load latest posts', error)
  }

  const featuredPost = latestPosts.docs[0]
  const secondaryPosts = latestPosts.docs.slice(0, 2)

  return (
    <main>
      {/* ── Section 1 : Intro ──────────────────────────────────────────── */}
      {introBlock && (
        <section style={sectionStyles.section}>
          <div
            style={{
              ...sectionStyles.shell,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.03fr) minmax(0, 1.17fr)',
              gap: '4.5rem',
              alignItems: 'start',
            }}
          >
            <div style={{ paddingTop: '1.6rem' }}>
              <FriezeBand width={620} />
              {introBlock.columns?.[0]?.richText && (
                <RichText
                  data={introBlock.columns[0].richText}
                  enableProse={false}
                  enableGutter={false}
                  className="max-w-[560px] [&_h1]:m-0 [&_h1]:font-[var(--font-dosis)] [&_h1]:text-[30px] [&_h1]:font-[400] [&_h1]:uppercase [&_h1]:leading-[1.12] [&_h1]:tracking-[0.01em] [&_h1]:text-[var(--e-global-color-primary)] [&_h2]:m-0 [&_h2]:font-[var(--font-dosis)] [&_h2]:text-[30px] [&_h2]:font-[400] [&_h2]:uppercase [&_h2]:leading-[1.12] [&_h2]:tracking-[0.01em] [&_h2]:text-[var(--e-global-color-primary)] [&_h3]:m-0 [&_h3]:font-[var(--font-dosis)] [&_h3]:text-[30px] [&_h3]:font-[400] [&_h3]:uppercase [&_h3]:leading-[1.12] [&_h3]:tracking-[0.01em] [&_h3]:text-[var(--e-global-color-primary)] [&_p]:m-0 [&_p]:font-[var(--font-dosis)] [&_p]:text-[30px] [&_p]:font-[400] [&_p]:uppercase [&_p]:leading-[1.12] [&_p]:tracking-[0.01em] [&_p]:text-[var(--e-global-color-primary)]"
                />
              )}
              {introBlock.columns?.[0]?.enableLink && introBlock.columns?.[0]?.link && (
                <div style={{ marginTop: '2rem' }}>
                  <CMSLink
                    {...introBlock.columns[0].link}
                    appearance="inline"
                    className="font-[var(--font-dosis)] text-[1.05rem] font-semibold uppercase tracking-[0.08em] text-[#10CCAE] no-underline"
                  />
                </div>
              )}
            </div>
            <div>
              {introBlock.columns?.[1]?.richText && (
                <RichText
                  data={introBlock.columns[1].richText}
                  enableProse={false}
                  enableGutter={false}
                  style={{ fontStyle: 'var(--e-global-typography-text-font-style, normal)' }}
                  className="max-w-none [&_p]:mb-6 [&_p]:font-[var(--font-dosis)] [&_p]:text-[25px] [&_p]:font-[300] [&_p]:leading-[1.55] [&_p]:tracking-[-0.01em] [&_p]:text-[#2e575d]"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 2 : Culture + Images ───────────────────────────────── */}
      {(galleryMedia.length > 0 || cultureBlock) && (
        <section style={{ ...sectionStyles.section, paddingTop: '1rem' }}>
          <div style={sectionStyles.shell}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.35fr)',
                gap: '4rem',
                alignItems: 'start',
              }}
            >
              <div>
                {galleryMedia.length >= 2 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '2rem',
                      marginBottom: '2.2rem',
                    }}
                  >
                    {galleryMedia.slice(0, 2).map((media) => (
                      <div key={media.id} style={{ aspectRatio: '0.78', overflow: 'hidden' }}>
                        <Media
                          resource={media}
                          imgClassName="h-full w-full object-cover"
                          videoClassName="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ paddingTop: '0.7rem' }}>
                <FriezeBand width={680} />
                {cultureBlock?.columns?.[0]?.richText && (
                  <RichText
                    data={cultureBlock.columns[0].richText}
                    enableGutter={false}
                    style={{ fontStyle: 'var(--e-global-typography-text-font-style, normal)' }}
                    className={`max-w-none [&_h2]:mb-6 [&_h3]:mb-6 [&_p]:mb-5 ${HOME_TITLE_CLASS} ${HOME_BODY_CLASS} [&_strong]:font-[600] [&_strong]:text-[#083f44]`}
                  />
                )}
                {cultureBlock?.columns?.[1]?.richText && (
                  <RichText
                    data={cultureBlock.columns[1].richText}
                    enableGutter={false}
                    style={{ fontStyle: 'var(--e-global-typography-text-font-style, normal)' }}
                    className={`max-w-none [&_p]:mb-5 ${HOME_BODY_CLASS}`}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 3 : CTA Banner plein-écran ─────────────────────────── */}
      {(soireeMedia || reasonsBlock) && (
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '5.5rem 2rem',
            minHeight: '340px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {soireeMedia && (
            <Media
              resource={soireeMedia}
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
              videoClassName="h-full w-full object-cover"
            />
          )}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(3,53,55,0.82), rgba(3,53,55,0.65))',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '1420px',
              margin: '0 auto',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '4rem',
              padding: '0 3rem',
            }}
          >
            <div style={{ flex: 1, maxWidth: '900px' }}>
              {reasonsBlock?.columns?.[0]?.richText && (
                <RichText
                  data={reasonsBlock.columns[0].richText}
                  enableGutter={false}
                  className="max-w-none [&_h2]:m-0 [&_h3]:m-0 [&_p]:m-0 [&_h2]:font-[var(--font-dosis)] [&_h2]:text-[30px] [&_h2]:font-[400] [&_h2]:uppercase [&_h2]:leading-[1.15] [&_h2]:tracking-[0.01em] [&_h2]:text-white [&_h3]:font-[var(--font-dosis)] [&_h3]:text-[30px] [&_h3]:font-[400] [&_h3]:uppercase [&_h3]:leading-[1.15] [&_h3]:tracking-[0.01em] [&_h3]:text-white [&_p]:font-[var(--font-dosis)] [&_p]:text-[30px] [&_p]:font-[400] [&_p]:uppercase [&_p]:leading-[1.15] [&_p]:tracking-[0.01em] [&_p]:text-white"
                />
              )}
            </div>
            <div style={{ flexShrink: 0 }}>
              <a
                href="/fr/reservations"
                style={{
                  display: 'inline-block',
                  background: '#ffce47',
                  color: '#0a4a4f',
                  textDecoration: 'none',
                  padding: '1.1rem 2.4rem',
                  fontFamily: DOSIS_FONT,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                Réserver &rsaquo;
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 4 : Articles / Posts ────────────────────────────────── */}
      {featuredPost && (
        <section style={{ ...sectionStyles.section, paddingTop: '2.5rem' }}>
          <div
            style={{
              ...sectionStyles.shell,
              display: 'grid',
              gridTemplateColumns: '420px minmax(0, 1fr)',
              gap: '3.5rem',
              alignItems: 'start',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              {getPostImage(featuredPost) && (
                <Media
                  resource={getPostImage(featuredPost)!}
                  imgClassName="h-full w-full object-cover"
                  videoClassName="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <FriezeBand width={980} />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '3rem',
                }}
              >
                {secondaryPosts.map((post) => (
                  <article key={post.id} style={{ borderBottom: '1px solid rgba(10,74,79,0.12)', paddingBottom: '1.5rem' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: DOSIS_FONT,
                        fontSize: '30px',
                        fontWeight: 400,
                        lineHeight: 1.08,
                        textTransform: 'uppercase',
                        color: 'var(--e-global-color-primary)',
                      }}
                    >
                      {post.title}
                    </h3>
                    {post.meta?.description && (
                      <p
                        style={{
                          margin: '1.4rem 0 2rem',
                          fontFamily: DOSIS_FONT,
                          fontSize: '25px',
                          fontWeight: 300,
                          lineHeight: 1.5,
                          color: '#6b7f83',
                          fontStyle: 'var(--e-global-typography-text-font-style, normal)',
                        }}
                      >
                        {post.meta.description}
                      </p>
                    )}
                    <div
                      style={{
                        fontFamily: DOSIS_FONT,
                        fontSize: '1.2rem',
                        fontWeight: 400,
                        color: '#55767a',
                      }}
                    >
                      Tiki Village
                      {formatPostDate(post.publishedAt) ? `  •  ${formatPostDate(post.publishedAt)}` : ''}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 5 : Galerie de vignettes ───────────────────────────── */}
      {allThumbnails.length > 0 && (
        <section style={{ ...sectionStyles.section, paddingTop: '1.5rem', paddingBottom: '3rem' }}>
          <div style={sectionStyles.shell}>
            <FriezeBand width={1240} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(allThumbnails.length, 6)}, minmax(0, 1fr))`,
                gap: '1rem',
              }}
            >
              {allThumbnails.map((media) => (
                <div
                  key={`thumb-${media.id}`}
                  style={{ aspectRatio: '1.35', overflow: 'hidden' }}
                >
                  <Media
                    resource={media}
                    imgClassName="h-full w-full object-cover"
                    videoClassName="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 6 : Pourquoi est-ce la visite inoubliable ? ─────── */}
      <section style={{ ...sectionStyles.section, background: '#fafafa' }}>
        <div
          style={{
            ...sectionStyles.shell,
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 0.75fr) minmax(0, 1.5fr)',
            gap: '4.5rem',
            alignItems: 'start',
          }}
        >
          <div style={{ position: 'relative', padding: '2rem 0' }}>
            <img
              src="/images/bg-frise-blanc-horiz-v3-1280.webp"
              alt=""
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.15,
              }}
            />
            <div style={{ position: 'relative' }}>
              <FriezeBand width={400} />
              <h2
                style={{
                  margin: 0,
                  fontFamily: DOSIS_FONT,
                  fontSize: '30px',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  color: 'var(--e-global-color-primary)',
                  lineHeight: 1.12,
                  letterSpacing: '0.01em',
                }}
              >
                Pourquoi Est-Ce La Visite Inoubliable ?
              </h2>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '2.8rem',
            }}
          >
            {pourquoiCards.map((card) => (
              <article
                key={card.number}
                style={{
                  paddingBottom: '1.5rem',
                  borderBottom: '2px solid #10CCAE',
                }}
              >
                <div
                  style={{
                    fontFamily: DOSIS_FONT,
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: '#10CCAE',
                    marginBottom: '0.4rem',
                    lineHeight: 1,
                  }}
                >
                  {card.number}.
                </div>
                <h3
                  style={{
                    margin: '0 0 0.8rem',
                    fontFamily: DOSIS_FONT,
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#033537',
                    lineHeight: 1.25,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontFamily: DOSIS_FONT,
                    fontSize: '1.05rem',
                    fontWeight: 300,
                    color: '#6b7f83',
                    lineHeight: 1.55,
                  }}
                >
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7 : Newsletter ─────────────────────────────────────── */}
      {newsletterBlock && (
        <section style={{ position: 'relative', background: '#033537', padding: '4rem 2rem', overflow: 'hidden' }}>
          <img
            src="/images/bg-frise-tapa-swirl-vertical-v2-1280.svg"
            alt=""
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            {newsletterBlock.richText && (
              <RichText
                data={newsletterBlock.richText}
                enableGutter={false}
                style={{ fontStyle: 'var(--e-global-typography-text-font-style, normal)' }}
                className="max-w-none [&_h2]:mb-3 [&_h2]:font-[var(--font-dosis)] [&_h2]:text-[30px] [&_h2]:font-[400] [&_h2]:uppercase [&_h2]:tracking-[0.01em] [&_h2]:text-[#FFCE47] [&_h3]:mb-8 [&_h3]:font-[var(--font-dosis)] [&_h3]:text-[30px] [&_h3]:font-[400] [&_h3]:uppercase [&_h3]:leading-[1.08] [&_h3]:tracking-[0.01em] [&_h3]:text-white [&_p]:mb-8 [&_p]:font-[var(--font-dosis)] [&_p]:text-[25px] [&_p]:font-[300] [&_p]:text-white/85"
              />
            )}
            <form action="/api/newsletter" method="post" style={{ display: 'flex', maxWidth: '520px', margin: '0 auto' }}>
              <input
                type="email"
                name="email"
                placeholder="Votre adresse e-mail"
                required
                style={{
                  flex: 1,
                  padding: '1rem 1.3rem',
                  border: 'none',
                  outline: 'none',
                  fontFamily: DOSIS_FONT,
                  fontSize: '1.2rem',
                  background: 'white',
                  color: '#333',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#FFCE47',
                  color: '#033537',
                  border: 'none',
                  padding: '1rem 1.65rem',
                  fontFamily: DOSIS_FONT,
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Envoyer
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ── Section 8 : Contact ────────────────────────────────────────── */}
      {(contactMedia || contactBlock) && (
        <section style={{ position: 'relative', padding: '5rem 0', overflow: 'hidden' }}>
          {contactMedia && (
            <Media
              resource={contactMedia}
              className="absolute inset-0 opacity-10"
              imgClassName="h-full w-full object-cover"
              videoClassName="h-full w-full object-cover"
            />
          )}
          <div
            style={{
              ...sectionStyles.shell,
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div>
              {contactMedia && (
                <Media
                  resource={contactMedia}
                  imgClassName="h-full w-full object-cover"
                  videoClassName="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <FriezeBand width={680} />
              {contactBlock?.columns?.[0]?.richText && (
                <RichText
                  data={contactBlock.columns[0].richText}
                  enableGutter={false}
                  style={{ fontStyle: 'var(--e-global-typography-text-font-style, normal)' }}
                  className={`max-w-none [&_h2]:mb-4 ${HOME_TITLE_CLASS} [&_p]:mb-4 ${HOME_BODY_CLASS} [&_p]:text-[#818181]`}
                />
              )}
              {contactBlock?.columns?.[0]?.enableLink && contactBlock?.columns?.[0]?.link && (
                <CMSLink
                  {...contactBlock.columns[0].link}
                  className="inline-block bg-[#033537] px-8 py-4 font-[var(--font-dosis)] text-[1rem] font-semibold uppercase tracking-[0.1em] text-white no-underline"
                />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
