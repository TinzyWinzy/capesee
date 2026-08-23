import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { DiscoveryCard, Icon, SearchBar, TourCard } from '@/components/ui'
import { MapSurface } from '@/components/maps/MapSurface'
import { mockTours, heroGallery, photoReel } from '@/lib/mock'
import { getNearbyDiscoveries } from '@/modules/discover/api/discoveries'
import { useAuthStore } from '@/stores/auth'

const MAP_MARKERS: Array<{ id: string; category: 'Place' | 'Traveler discovery' | 'Historical site'; lat: number; lng: number; label: string }> = [
  { id: 'home-wine', category: 'Place', lat: -33.9364, lng: 18.8616, label: 'Wine farm' },
  { id: 'home-sighting', category: 'Traveler discovery', lat: -33.987, lng: 18.431, label: 'New sighting' },
  { id: 'home-heritage', category: 'Historical site', lat: -33.9259, lng: 18.4277, label: 'Heritage' },
]

const STAMP = (
  <div className="expedition-stamp" aria-hidden>
    <svg viewBox="0 0 120 120">
      <defs>
        <path id="stampCircle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" fill="none" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.55" />
      <text className="stamp-ring" fill="currentColor">
        <textPath href="#stampCircle">FIELD GUIDE TO THE CAPE · EST. 2026 · 34°S 18°E ·</textPath>
      </text>
      <g stroke="currentColor" fill="none">
        <line x1="60" y1="44" x2="60" y2="76" />
        <line x1="44" y1="60" x2="76" y2="60" />
        <circle cx="60" cy="60" r="3" fill="currentColor" stroke="none" />
        <circle cx="60" cy="60" r="8.5" strokeWidth="0.75" />
      </g>
    </svg>
  </div>
)

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
      {/* ── FULL-BLEED HERO with cycling Cape photography ── */}
      <section className="discover-hero discover-hero--photo">
        {/* Photo stack — only active slide visible, Ken Burns zoom */}
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

        {/* Dots nav */}
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

        {/* Caption */}
        <p className="hero-photo-caption" aria-live="polite">
          {heroGallery[heroIndex].alt}
        </p>

        {STAMP}

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
              placeholder="Search places, stories or experiences"
              onSubmit={(q) => navigate({ to: '/discover/search', search: { q } })}
            />
          </div>
          <div className="discover-primary-actions">
            <Link to="/discover/nearby" className="btn btn-flame">Explore nearby <Icon name="arrow" /></Link>
            <Link to="/discover/map" className="discover-text-action discover-text-action--light">Open the living map <Icon name="arrow" /></Link>
          </div>
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
                <li><span>01</span><strong>Place</strong><small>Verified places, every one source-backed</small></li>
                <li><span>02</span><strong>Living reports</strong><small>Traveler discoveries, dated and real</small></li>
                <li><span>03</span><strong>Local experience</strong><small>Bookable experiences rooted in place</small></li>
              </ul>
            </div>
            <aside className="about-note-card">
              <p className="eyebrow">Field note · Est. 2026</p>
              <blockquote>"Built for travellers who want the real Cape — the one the postcards never show."</blockquote>
              <span className="about-note-coord">34°00′S · 18°28′E</span>
            </aside>
          </div>
        </section>

        {/* ── PHOTO GRID — hand-picked Cape moments ── */}
        <section className="discover-section photo-grid-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 03 — From the field</p>
              <h2>Moments captured across the Cape</h2>
            </div>
          </div>
          <div className="photo-mosaic">
            <div className="photo-mosaic-main">
              <img src="/images/IMG-20260823-WA0153.jpg" alt="Chapman's Peak — Hout Bay lookout" loading="lazy" />
              <span className="photo-mosaic-label">Chapman's Peak</span>
            </div>
            <div className="photo-mosaic-side">
              <div className="photo-mosaic-item">
                <img src="/images/IMG-20260823-WA0180.jpg" alt="Sunburst through the Winelands oaks" loading="lazy" />
                <span className="photo-mosaic-label">Stellenbosch</span>
              </div>
              <div className="photo-mosaic-item">
                <img src="/images/IMG-20260823-WA0141.jpg" alt="Camps Bay beach at dusk" loading="lazy" />
                <span className="photo-mosaic-label">Camps Bay</span>
              </div>
            </div>
            <div className="photo-mosaic-bottom">
              <div className="photo-mosaic-item">
                <img src="/images/IMG-20260823-WA0192.jpg" alt="Cape farmhouse lawn" loading="lazy" />
                <span className="photo-mosaic-label">Wine Estate</span>
              </div>
              <div className="photo-mosaic-item">
                <img src="/images/IMG-20260823-WA0119.jpg" alt="Golden hour sunset" loading="lazy" />
                <span className="photo-mosaic-label">Sunset</span>
              </div>
              <div className="photo-mosaic-item">
                <img src="/images/IMG-20260823-WA0173.jpg" alt="Suspension bridge at the estate" loading="lazy" />
                <span className="photo-mosaic-label">Estate Walk</span>
              </div>
            </div>
          </div>
        </section>

        <section className="discover-section nearby-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 04 — From the field</p>
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
