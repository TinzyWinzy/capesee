import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiscoveryCard, Icon, SearchBar, TourCard } from '@/components/ui'
import { IconWinePour, IconCompass, IconDiscovery } from '@/components/ui/AnimatedIcons'
import { MapSurface } from '@/components/maps/MapSurface'
import { mockTours } from '@/lib/mock'
import { galleryImages } from '@/lib/gallery'
import { getNearbyDiscoveries } from '@/modules/discover/api/discoveries'
import { useAuthStore } from '@/stores/auth'

const heroGallery = galleryImages.slice(0, 8)
const photoReel = galleryImages

const MAP_MARKERS: Array<{ id: string; category: 'Place' | 'Traveler discovery' | 'Historical site'; lat: number; lng: number; label: string }> = [
  { id: 'home-wine', category: 'Place', lat: -33.9364, lng: 18.8616, label: 'Wine farm' },
  { id: 'home-sighting', category: 'Traveler discovery', lat: -33.987, lng: 18.431, label: 'New sighting' },
  { id: 'home-heritage', category: 'Historical site', lat: -33.9259, lng: 18.4277, label: 'Heritage' },
]

function CinematicBreak() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [canAutoplay, setCanAutoplay] = useState(true)
  const [showPoster, setShowPoster] = useState(false)

  useEffect(() => {
    // Respect save-data / low bandwidth: don't autoplay video
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') {
      setCanAutoplay(false)
      setIsPlaying(false)
      setShowPoster(true)
      return
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) {
      setCanAutoplay(false)
      setIsPlaying(false)
      return
    }
  }, [])

  useEffect(() => {
    if (!canAutoplay || showPoster) return
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [canAutoplay, showPoster])

  const toggle = () => {
    const v = videoRef.current
    if (!v || showPoster) return
    if (v.paused) {
      v.play().catch(() => {})
      setIsPlaying(true)
    } else {
      v.pause()
      setIsPlaying(false)
    }
  }

  // poster fallback: Chapman's Peak hero
  const posterSrc = galleryImages[9]?.src ?? '/images/IMG-20260823-WA0153.jpg'

  return (
    <section className="cinematic-break" aria-label="The Cape in motion — field video">
      <div className="cinematic-media">
        {!showPoster ? (
          <video
            ref={videoRef}
            className="cinematic-video"
            autoPlay={canAutoplay}
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
            aria-hidden
            onError={() => setShowPoster(true)}
          >
            <source src="/videos/VID-20260823-WA0158.mp4" type="video/mp4" />
          </video>
        ) : (
          <img className="cinematic-poster" src={posterSrc} alt="Chapman's Peak — field capture" loading="lazy" />
        )}
        <div className="cinematic-scrim" aria-hidden />
        <div className="cinematic-grain" aria-hidden />
      </div>

      <div className="cinematic-overlay">
        <p className="eyebrow cinematic-kicker">
          <span className="live-dot" aria-hidden /> No. 02½ — In motion · Field video
        </p>
        <h2>
          The Cape, <em>poured</em> in real light.
        </h2>
        <p className="cinematic-copy">
          Not a stock reel. A single, uncut field capture — wind on the vineyard, light on the bay. Press play and stay a
          moment. Then follow it to the living map.
        </p>
        <div className="cinematic-actions">
          <Link to="/discover/gallery" className="btn btn-flame">
            Watch all 15 field videos <Icon name="arrow" />
          </Link>
          <Link to="/discover/map" className="cinematic-text-action">
            Open living map <Icon name="arrow" />
          </Link>
        </div>
      </div>

      <div className="cinematic-controls">
        {!showPoster ? (
          <button type="button" className="cinematic-toggle" onClick={toggle} aria-label={isPlaying ? 'Pause field video' : 'Play field video'}>
            <span aria-hidden>{isPlaying ? '❙❙' : '▶'}</span>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        ) : (
          <button type="button" className="cinematic-toggle" onClick={() => setShowPoster(false)} aria-label="Load field video">
            <span aria-hidden>▶</span> Load video
          </button>
        )}
        <span className="cinematic-meta">VID-20260823-WA0158 · 16s · muted · 832×464</span>
      </div>

      <span className="cinematic-coord" aria-hidden>
        33°55′S · 18°25′E
      </span>
    </section>
  )
}

/** T01 — Landing / Discover Home. Full-bleed hero with real Cape photography. */

export function DiscoverHomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const initials = user?.fullName?.charAt(0) ?? '?'
  const nearbyPins = getNearbyDiscoveries().slice(0, 2)

  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroGallery.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="discover-home">
      {/* ── CLEAN FULL-BLEED HERO ── */}
      <section className="discover-hero discover-hero--clean">
        {/* Background photo stack with dark gradient overlay */}
        <div className="hero-photo-stack" aria-hidden>
          {heroGallery.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`hero-photo-slide${i === heroIndex ? ' is-active' : ''}`}
              draggable={false}
            />
          ))}
          <div className="hero-photo-gradient" />
        </div>

        <div className="discover-mobile-brand mobile-only">
          <Link to="/discover" className="brand">CAPE<span>SEE</span></Link>
          <Link to={user ? '/account/profile' : '/auth/login'} className="avatar" aria-label="Profile">{initials}</Link>
        </div>

        <div className="discover-hero-copy">
          <p className="eyebrow discover-kicker">Field guide to the Cape</p>
          <h1>See the Cape <em>beyond the postcard.</em></h1>
          <p className="discover-intro">
            Follow living discoveries, source-backed stories and memorable local experiences—all connected to place.
          </p>
          
          <div className="discover-search">
            <SearchBar
              placeholder="Search places, stories or experiences..."
              onSubmit={(q) => navigate({ to: '/discover/search', search: { q } })}
            />
          </div>

          <div className="discover-primary-actions">
            <Link to="/discover/nearby" className="btn btn-flame">Explore nearby <Icon name="arrow" /></Link>
            <Link to="/discover/map" className="discover-text-action discover-text-action--light">Open living map <Icon name="arrow" /></Link>
          </div>
        </div>

        {/* Clean bottom photo status bar */}
        <div className="hero-status-bar">
          <div className="hero-dots" role="tablist" aria-label="Photo slideshow">
            {heroGallery.map((img, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === heroIndex}
                aria-label={img.alt}
                className={`hero-dot${i === heroIndex ? ' is-active' : ''}`}
                onClick={() => setHeroIndex(i)}
              />
            ))}
          </div>
          <span className="hero-photo-label">
            <span className="live-dot" aria-hidden /> {heroGallery[heroIndex].alt}
          </span>
        </div>
      </section>


      {/* ── PHOTO REEL — infinite scrolling strip ── */}
      <section className="photo-reel-section" aria-label="Field photographs from the Cape">
        <div className="photo-reel-track">
          {[...photoReel, ...photoReel].map((img, i) => (
            <div key={`${img.src}-${i}`} className="photo-reel-item">
              <img src={img.src} alt={img.alt} loading="lazy" />
              <p className="photo-reel-caption">{img.alt}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="discover-content">
        <section className="discover-section experience-section booking-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 01 — Book a local experience</p>
              <h2>Experiences rooted in place</h2>
            </div>
            <Link to="/book/tours" className="editorial-link">Explore all <span aria-hidden>→</span></Link>
          </div>
          <div className="experience-layout">
            {mockTours.slice(0, 2).map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        </section>

        <section className="discover-section about-section">
          <div className="about-layout">
            <div className="about-copy">
              <div className="discover-section-heading">
                <div>
                  <p className="eyebrow">No. 02 — About us</p>
                  <h2>A field guide, not a brochure.</h2>
                </div>
              </div>
              <p>
                Capesee is a living field guide to the Cape. Every place on the map is tied to the reports of people
                who have been there and the experiences of locals who know it best — no postcards, no guesswork.
              </p>
              <ul className="about-pillars">
                <li><IconWinePour /><span>01</span><strong>Place</strong><small>Verified places, every one source-backed</small></li>
                <li><IconCompass /><span>02</span><strong>Living reports</strong><small>Traveler discoveries, dated and real</small></li>
                <li><IconDiscovery /><span>03</span><strong>Local experience</strong><small>Bookable experiences rooted in place</small></li>
              </ul>
            </div>
            <aside className="about-note-card">
              <p className="eyebrow">Field note · Est. 2026</p>
              <blockquote>"Built for travellers who want the real Cape — the one the postcards never show."</blockquote>
              <span className="about-note-coord">34°00′S · 18°28′E</span>
            </aside>
          </div>
        </section>

        <CinematicBreak />

        {/* ── PHOTO GRID — all field captures (84 images) — */}
        <section className="discover-section photo-grid-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 03 — From the field · {galleryImages.length} captures</p>
              <h2>Moments captured across the Cape</h2>
            </div>
            <Link to="/discover/gallery" className="editorial-link">View full gallery <span aria-hidden>→</span></Link>
          </div>
          <div className="photo-mosaic">
            <div className="photo-mosaic-main">
              <img src={galleryImages[9]?.src ?? '/images/IMG-20260823-WA0153.jpg'} alt={galleryImages[9]?.alt ?? "Chapman's Peak — Hout Bay lookout"} loading="lazy" />
              <span className="photo-mosaic-label">Chapman's Peak</span>
            </div>
            <div className="photo-mosaic-side">
              <div className="photo-mosaic-item">
                <img src={galleryImages[5]?.src ?? '/images/IMG-20260823-WA0180.jpg'} alt={galleryImages[5]?.alt ?? 'Stellenbosch'} loading="lazy" />
                <span className="photo-mosaic-label">Stellenbosch</span>
              </div>
              <div className="photo-mosaic-item">
                <img src={galleryImages[2]?.src ?? '/images/IMG-20260823-WA0141.jpg'} alt={galleryImages[2]?.alt ?? 'Camps Bay'} loading="lazy" />
                <span className="photo-mosaic-label">Camps Bay</span>
              </div>
            </div>
            <div className="photo-mosaic-bottom">
              <div className="photo-mosaic-item">
                <img src={galleryImages[28]?.src ?? '/images/IMG-20260823-WA0192.jpg'} alt={galleryImages[28]?.alt ?? 'Wine Estate'} loading="lazy" />
                <span className="photo-mosaic-label">Wine Estate</span>
              </div>
              <div className="photo-mosaic-item">
                <img src={galleryImages[3]?.src ?? '/images/IMG-20260823-WA0119.jpg'} alt={galleryImages[3]?.alt ?? 'Sunset'} loading="lazy" />
                <span className="photo-mosaic-label">Sunset</span>
              </div>
              <div className="photo-mosaic-item">
                <img src={galleryImages[27]?.src ?? '/images/IMG-20260823-WA0173.jpg'} alt={galleryImages[27]?.alt ?? 'Estate Walk'} loading="lazy" />
                <span className="photo-mosaic-label">Estate Walk</span>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: 16 }}>
            <Link to="/discover/gallery" className="btn btn-outline">Browse all {galleryImages.length} photos & 15 videos</Link>
          </div>
        </section>

        <section className="discover-section nearby-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 04 — Stories from past tours</p>
              <h2>The Cape, as it was lived</h2>
            </div>
            <Link to="/discover/stories" className="editorial-link">All stories <span aria-hidden>→</span></Link>
          </div>
          <div className="discover-card-row" style={{ gap: 16 }}>
            <Link to="/discover/stories" className="card" style={{ flex: '1 1 280px', textDecoration: 'none' }}>
              <img src={galleryImages[1]?.src} alt="Past story" style={{ width:'100%', height: 160, objectFit:'cover', borderRadius: 8 }} loading="lazy" />
              <span className="bold text-small" style={{ marginTop: 8, display:'block' }}>Past experiences as stories</span>
              <p className="text-faint text-xs">Client publishes a completed tour — narrative + gallery — optionally linked to the bookable product.</p>
              <span className="editorial-link" style={{ marginTop: 8 }}>Read stories →</span>
            </Link>
            <Link to="/discover/gallery" className="card" style={{ flex: '1 1 280px', textDecoration: 'none' }}>
              <img src={galleryImages[65]?.src ?? galleryImages[0].src} alt="Gallery" style={{ width:'100%', height: 160, objectFit:'cover', borderRadius: 8 }} loading="lazy" />
              <span className="bold text-small" style={{ marginTop: 8, display:'block' }}>Field gallery · {galleryImages.length} photos</span>
              <p className="text-faint text-xs">Every image showcased — browse the full masonry gallery with videos.</p>
              <span className="editorial-link" style={{ marginTop: 8 }}>Open gallery →</span>
            </Link>
          </div>
        </section>

        <section className="discover-section nearby-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 05 — From the field</p>
              <h2>Happening near you</h2>
            </div>
            <Link to="/discover/nearby" className="editorial-link">View nearby <span aria-hidden>→</span></Link>
          </div>
          <div className={`discover-card-row discovery-row${nearbyPins.length === 0 ? ' is-empty' : ''}`}>
            {nearbyPins.map((pin) => (
              <DiscoveryCard key={pin.id} pin={pin} />
            ))}
            <Link to="/journal/create" className="add-discovery-card">
              <span className="add-mark" aria-hidden>＋</span>
              <span><strong>Found something?</strong><small>Add it to the living map.</small></span>
            </Link>
          </div>
        </section>
      </div>

      <section className="discover-section map-section">
        <div className="discover-section-heading">
          <div>
            <p className="eyebrow">No. 05 — The living map</p>
            <h2>The Cape, unfolding in real time</h2>
          </div>
          <Link to="/discover/map" className="editorial-link">Open map <span aria-hidden>→</span></Link>
        </div>
        <Link to="/discover/map" className="discover-map-feature" aria-label="Open the discovery map">
          <div className="discover-map-heading">
            <div>
              <p className="eyebrow">Live discovery map</p>
              <strong>What's unfolding nearby</strong>
            </div>
            <span className="live-stamp"><span className="live-dot" aria-hidden />LIVE</span>
          </div>
          <MapSurface
            className="discover-map-canvas"
            markers={MAP_MARKERS}
            myLocation={{ lat: -33.9057, lng: 18.4203 }}
          />
          <div className="discover-map-note">
            <span className="live-dot" aria-hidden />
            Traveler reports and verified places, updated as the Cape changes.
            <span className="map-open-action">Open map <Icon name="arrow" /></span>
          </div>
        </Link>
      </section>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <Link to="/discover" className="brand">CAPE<span>SEE</span></Link>
            <p>A living field guide to the Cape — follow real discoveries, source-backed stories and local experiences, all connected to place.</p>
          </div>
          <nav className="site-footer-col" aria-label="Discover">
            <strong>Discover</strong>
            <Link to="/discover/nearby">Explore nearby</Link>
            <Link to="/discover/map">Living map</Link>
            <Link to="/discover/search" search={{ q: '' }}>Search the Cape</Link>
          </nav>
          <nav className="site-footer-col" aria-label="Book">
            <strong>Book</strong>
            <Link to="/book/tours">Tours</Link>
            <Link to="/book/experiences">Experiences</Link>
            <Link to="/book/cart">Trip cart</Link>
          </nav>
          <nav className="site-footer-col" aria-label="Field">
            <strong>Field</strong>
            <Link to="/journal">Journal</Link>
            <Link to={user ? '/account/profile' : '/auth/login'}>Profile</Link>
          </nav>
        </div>
        <div className="site-footer-rule" aria-hidden>
          <span className="hairline" />
          <span className="diamond" />
          <span className="coord">34°00′S · 18°28′E</span>
          <span className="hairline" />
        </div>
        <p className="site-footer-legal">© 2026 Capesee · Field guide to the Cape · Made in the Cape</p>
      </footer>
    </main>
  )
}
