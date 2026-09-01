import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { galleryImages, galleryVideos } from '@/lib/gallery'

export function GalleryPage() {
  const [active, setActive] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all')

  return (
    <main className="page-narrow" style={{ maxWidth: 1100 }}>
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
        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={()=>setActive(null)}>
          <img src={active} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
        </div>
      )}
    </main>
  )
}
