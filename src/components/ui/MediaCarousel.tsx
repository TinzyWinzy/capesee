import { useState } from 'react'

/** Horizontal swipeable carousel. Images render as placeholders when no URL. */
export function MediaCarousel({ images, alt = '' }: { images: Array<string | undefined>; alt?: string }) {
  const [index, setIndex] = useState(0)
  const slides = images.length > 0 ? images : [undefined]
  const active = Math.min(index, slides.length - 1)

  return (
    <div className="media ratio-16-9" style={{ borderRadius: 'var(--radius)' }}>
      {slides[active] ? (
        <img src={slides[active]} alt={alt} />
      ) : (
        <div className="col" style={{ alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 30 }}>◇</span>
          <span className="text-small">{alt || 'Photo coming soon'}</span>
        </div>
      )}
      {slides.length > 1 ? (
        <>
          <div
            className="row"
            style={{ position: 'absolute', inset: 'auto 0 8px', justifyContent: 'center', gap: 6 }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  border: 'none',
                  padding: 0,
                  background: i === active ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            aria-label="Previous"
            onClick={() => setIndex((active - 1 + slides.length) % slides.length)}
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)' }}
          >
            ‹
          </button>
          <button
            className="btn btn-ghost btn-sm"
            aria-label="Next"
            onClick={() => setIndex((active + 1) % slides.length)}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)' }}
          >
            ›
          </button>
        </>
      ) : null}
    </div>
  )
}
