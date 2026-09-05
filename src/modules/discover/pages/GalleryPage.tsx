import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { galleryImages, galleryVideos } from '@/lib/gallery'
import { Seo } from '@/components/Seo'

export function GalleryPage() {
  const [active, setActive] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all')
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const lastActiveRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    lastActiveRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // focus close button for keyboard users
    window.setTimeout(() => closeBtnRef.current?.focus(), 0)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      lastActiveRef.current?.focus()
    }
  }, [active])

  return (
    <main className="page-narrow" style={{ maxWidth: 1100 }}>
      <Seo
        title="Field Gallery"
        description={`Browse ${galleryImages.length} field photos and ${galleryVideos.length} videos from the Cape — Chapman's Peak, Stellenbosch vineyards, Atlantic cliffs and more. All captures shot in the field.`}
        canonical="/discover/gallery"
        image={galleryImages[0]?.src}
      />
      <div className="row-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="section-title">Field Gallery</h1>
          <p className="text-faint text-small">{galleryImages.length} photos · {galleryVideos.length} videos · All field captures, showcased</p>
        </div>
        <Link to="/discover" className="btn btn-ghost btn-sm">← Discover</Link>
      </div>

      <div className="row wrap" style={{ marginBottom: 16, gap: 8 }}>
        {(['all','images','videos'] as const).map(f => (
          <button key={f} className={filter===f ? 'chip chip-active' : 'chip'} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>

      {(filter==='all' || filter==='images') && (
        <>
          <h2 className="eyebrow" style={{ marginBottom: 8 }}>Photos — {galleryImages.length}</h2>
          <div className="gallery-masonry">
            {galleryImages.map(img => (
              <button key={img.src} className="gallery-item" onClick={()=>setActive(img.src)} aria-label={img.alt}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <span className="gallery-caption">{img.alt}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {(filter==='all' || filter==='videos') && (
        <>
          <h2 className="eyebrow" style={{ margin: '24px 0 8px' }}>Videos — {galleryVideos.length}</h2>
          <div className="grid-2">
            {galleryVideos.map(v => (
              <div key={v.src} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <video src={v.src} controls preload="metadata" style={{ width: '100%', display: 'block' }} />
                <p className="text-xs" style={{ padding: 8 }}>{v.alt}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {active && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview — press Escape to close"
          onClick={() => setActive(null)}
        >
          <button
            ref={closeBtnRef}
            type="button"
            className="btn btn-ghost"
            onClick={() => setActive(null)}
            aria-label="Close preview"
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(11,33,30,.6)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}
          >
            ✕ Close
          </button>
          <img
            src={active}
            alt={galleryImages.find((g) => g.src === active)?.alt ?? 'Field capture preview'}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  )
}
