import { Card } from '@/components/Card'
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

  return (
    <main>
      {introBlock && (
        <section style={{ background: 'white', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '80px', marginBottom: '1.5rem' }} />
              {introBlock.columns?.[0]?.richText && (
                <RichText
                  data={introBlock.columns[0].richText}
                  enableGutter={false}
                  className="max-w-none [&_h2]:mb-6 [&_h2]:font-[Nohemi,sans-serif] [&_h2]:text-[clamp(1rem,2.5vw,1.2rem)] [&_h2]:font-normal [&_h2]:uppercase [&_h2]:tracking-[0.05em] [&_h2]:text-[#033537] [&_h2]:leading-[1.4]"
                />
              )}
              {introBlock.columns?.[0]?.enableLink && introBlock.columns?.[0]?.link && (
                <CMSLink
                  {...introBlock.columns[0].link}
                  appearance="inline"
                  className="font-[Nohemi,sans-serif] text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#10CCAE] no-underline"
                />
              )}
            </div>
            <div>
              {introBlock.columns?.[1]?.richText && (
                <RichText
                  data={introBlock.columns[1].richText}
                  enableGutter={false}
                  className="max-w-none [&_p]:mb-6 [&_p]:text-[#818181]"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {galleryMedia.length > 0 && (
        <section style={{ padding: '0 0 3rem' }}>
          <img src="/images/bg-frise-blanc-horiz-v3-1280.webp" alt="" aria-hidden style={{ width: '100%', display: 'block', marginBottom: '-2px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {galleryMedia.map((media) => (
              <div key={media.id} style={{ aspectRatio: '1', overflow: 'hidden' }}>
                <Media resource={media} imgClassName="h-full w-full object-cover" videoClassName="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <img src="/images/bg-frise-blanc-horiz-v3-1280.webp" alt="" aria-hidden style={{ width: '100%', display: 'block', transform: 'scaleY(-1)', marginTop: '-2px' }} />
        </section>
      )}

      {cultureBlock && (
        <section style={{ background: '#f9f9f7', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '60px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div>
                {cultureBlock.columns?.[0]?.richText && (
                  <RichText
                    data={cultureBlock.columns[0].richText}
                    enableGutter={false}
                    className="max-w-none [&_h2]:mb-4 [&_h2]:font-[Nohemi,sans-serif] [&_h2]:text-[0.72rem] [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-[0.3em] [&_h2]:text-[#033537] [&_h3]:mb-6 [&_h3]:text-[#033537] [&_p]:mb-6 [&_p]:text-[#818181]"
                  />
                )}
                {cultureBlock.columns?.[1]?.enableLink && cultureBlock.columns?.[1]?.link && (
                  <CMSLink {...cultureBlock.columns[1].link} className="inline-block bg-[#033537] px-8 py-3 font-[Nohemi,sans-serif] text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white no-underline" />
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {cultureMedia[0] && <div style={{ gridRow: 'span 2' }}><Media resource={cultureMedia[0]} imgClassName="h-full w-full object-cover" videoClassName="h-full w-full object-cover" /></div>}
                {cultureMedia[1] && <Media resource={cultureMedia[1]} imgClassName="h-full w-full object-cover" videoClassName="h-full w-full object-cover" />}
                {cultureMedia[2] && <Media resource={cultureMedia[2]} imgClassName="h-full w-full object-cover" videoClassName="h-full w-full object-cover" />}
              </div>
            </div>
          </div>
        </section>
      )}

      {(soireeMedia || reasonsBlock) && (
        <section style={{ background: 'white', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '60px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div>{soireeMedia && <Media resource={soireeMedia} imgClassName="h-full w-full object-cover" videoClassName="h-full w-full object-cover" />}</div>
              <div>
                {reasonsBlock?.columns?.[0]?.richText && (
                  <RichText
                    data={reasonsBlock.columns[0].richText}
                    enableGutter={false}
                    className="max-w-none [&_h2]:mb-4 [&_h2]:font-[Nohemi,sans-serif] [&_h2]:text-[0.72rem] [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-[0.3em] [&_h2]:text-[#033537] [&_h3]:mb-8 [&_h3]:text-[#0b4a50] [&_p]:mb-7 [&_p]:text-[#7a7a7a]"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {ctaBanner && (
        <section style={{ position: 'relative', background: '#033537', padding: '4rem 2rem', overflow: 'hidden', textAlign: 'center' }}>
          <img src="/images/bg-tapa-vertical-gauche-v2-1280.svg" alt="" aria-hidden style={{ position: 'absolute', left: 0, top: 0, height: '100%', opacity: 0.15 }} />
          <img src="/images/bg-tapa-vertical-v2-1280.svg" alt="" aria-hidden style={{ position: 'absolute', right: 0, top: 0, height: '100%', opacity: 0.15 }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
            {ctaBanner.richText && <RichText data={ctaBanner.richText} enableGutter={false} className="max-w-none [&_h2]:mb-8 [&_h2]:font-[Nohemi,sans-serif] [&_h2]:text-[clamp(1.5rem,4vw,2.8rem)] [&_h2]:font-bold [&_h2]:uppercase [&_h2]:leading-[1.2] [&_h2]:text-white" />}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {(ctaBanner.links || []).map(({ link }, index) => (
                <CMSLink key={index} {...link} className="inline-block bg-[#FFCE47] px-10 py-4 font-[Nohemi,sans-serif] text-[0.78rem] font-bold uppercase tracking-[0.15em] text-[#033537] no-underline" />
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonialsBlock && (
        <section style={{ background: '#f9f9f7', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '60px', margin: '0 auto 1.5rem' }} />
            {testimonialsBlock.columns?.[0]?.richText && <RichText data={testimonialsBlock.columns[0].richText} enableGutter={false} className="max-w-none [&_h2]:mb-12 [&_h2]:font-[Nohemi,sans-serif] [&_h2]:text-[0.72rem] [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-[0.3em] [&_h2]:text-[#033537] [&_p]:mb-8 [&_p]:text-[#555]" />}
          </div>
        </section>
      )}

      {latestPosts.docs.length > 0 && (
        <section style={{ background: 'white', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Nohemi, sans-serif', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#033537', fontWeight: 500 }}>
                ACTUALITÉS
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '2rem' }}>
              {latestPosts.docs.map((post: Post) => (
                <Card key={post.id} doc={post} relationTo="posts" />
              ))}
            </div>
          </div>
        </section>
      )}

      {newsletterBlock && (
        <section style={{ position: 'relative', background: '#033537', padding: '4rem 2rem', overflow: 'hidden' }}>
          <img src="/images/bg-frise-tapa-swirl-vertical-v2-1280.svg" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            {newsletterBlock.richText && <RichText data={newsletterBlock.richText} enableGutter={false} className="max-w-none [&_h2]:mb-3 [&_h2]:font-[Nohemi,sans-serif] [&_h2]:text-[0.72rem] [&_h2]:uppercase [&_h2]:tracking-[0.3em] [&_h2]:text-[#FFCE47] [&_h3]:mb-8 [&_h3]:font-[Nohemi,sans-serif] [&_h3]:text-[clamp(2rem,5vw,3rem)] [&_h3]:font-bold [&_h3]:uppercase [&_h3]:text-white [&_p]:mb-8 [&_p]:text-white/80" />}
            <form action="/api/newsletter" method="post" style={{ display: 'flex', maxWidth: '460px', margin: '0 auto' }}>
              <input type="email" name="email" placeholder="Votre adresse e-mail" required style={{ flex: 1, padding: '0.85rem 1.25rem', border: 'none', outline: 'none', fontSize: '0.9rem', background: 'white', color: '#333' }} />
              <button type="submit" style={{ background: '#FFCE47', color: '#033537', border: 'none', padding: '0.85rem 1.5rem', fontFamily: 'Nohemi, sans-serif', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                ENVOYER
              </button>
            </form>
          </div>
        </section>
      )}

      {(contactMedia || contactBlock) && (
        <section style={{ position: 'relative', padding: '5rem 2rem', overflow: 'hidden' }}>
          {contactMedia && <Media resource={contactMedia} className="absolute inset-0 opacity-10" imgClassName="h-full w-full object-cover" videoClassName="h-full w-full object-cover" />}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>{contactMedia && <Media resource={contactMedia} imgClassName="h-full w-full object-cover" videoClassName="h-full w-full object-cover" />}</div>
            <div>
              <img src="/images/bg-frise-horiz-v2-1280.svg" alt="" aria-hidden style={{ width: '60px', marginBottom: '1.5rem' }} />
              {contactBlock?.columns?.[0]?.richText && <RichText data={contactBlock.columns[0].richText} enableGutter={false} className="max-w-none [&_h2]:mb-4 [&_h2]:font-[Nohemi,sans-serif] [&_h2]:text-[clamp(1.5rem,3vw,2rem)] [&_h2]:font-semibold [&_h2]:leading-[1.3] [&_h2]:text-[#033537] [&_p]:mb-4 [&_p]:text-[#818181]" />}
              {contactBlock?.columns?.[0]?.enableLink && contactBlock?.columns?.[0]?.link && (
                <CMSLink {...contactBlock.columns[0].link} className="inline-block bg-[#033537] px-8 py-4 font-[Nohemi,sans-serif] text-[0.75rem] font-bold uppercase tracking-[0.15em] text-white no-underline" />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
