import { Link, useNavigate } from '@tanstack/react-router'
import { DiscoveryCard, Icon, SearchBar, TourCard } from '@/components/ui'
import { MapSurface } from '@/components/maps/MapSurface'
import { mockTours } from '@/lib/mock'
import { getNearbyDiscoveries } from '@/modules/discover/api/discoveries'
import { useAuthStore } from '@/stores/auth'

const CONTOURS = (
  <svg className="contour-layer" viewBox="0 0 1440 760" preserveAspectRatio="none" aria-hidden>
    <g fill="none" stroke="var(--color-cream)" strokeWidth="1">
      <path d="M-40 520 C 260 470 380 560 620 510 S 980 430 1500 500" opacity="0.16" />
      <path d="M-40 560 C 300 515 440 610 700 560 S 1060 480 1500 550" opacity="0.1" />
      <path d="M-40 600 C 340 565 500 660 780 610 S 1140 530 1500 600" opacity="0.14" />
      <path d="M-40 640 C 380 615 560 705 860 660 S 1220 580 1500 650" opacity="0.09" />
      <path d="M900 120 C 1000 90 1120 130 1240 110 S 1400 140 1520 120" opacity="0.12" />
      <path d="M1020 180 C 1100 160 1180 185 1280 170" opacity="0.09" />
    </g>
  </svg>
)

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

const MAP_MARKERS: Array<{ id: string; category: 'Place' | 'Traveler discovery' | 'Historical site'; lat: number; lng: number; label: string }> = [
  { id: 'home-wine', category: 'Place', lat: -33.9364, lng: 18.8616, label: 'Wine farm' },
  { id: 'home-sighting', category: 'Traveler discovery', lat: -33.987, lng: 18.431, label: 'New sighting' },
  { id: 'home-heritage', category: 'Historical site', lat: -33.9259, lng: 18.4277, label: 'Heritage' },
]

/** T01 — Landing / Discover Home. Wireframe spec §3. Bold Cape expedition. */
export function DiscoverHomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const initials = user?.fullName?.charAt(0) ?? '?'
  const nearbyPins = getNearbyDiscoveries().slice(0, 2)

  return (
    <main className="discover-home">
      <section className="discover-hero">
        <div className="discover-atlas-lines" aria-hidden />
        {CONTOURS}
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
            <Link to="/discover/map" className="discover-text-action">Open the living map <Icon name="arrow" /></Link>
          </div>
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
              <blockquote>“Built for travellers who want the real Cape — the one the postcards never show.”</blockquote>
              <span className="about-note-coord">34°00′S · 18°28′E</span>
            </aside>
          </div>
        </section>

        <section className="discover-section nearby-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 03 — From the field</p>
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
            <p className="eyebrow">No. 04 — The living map</p>
            <h2>The Cape, unfolding in real time</h2>
          </div>
          <Link to="/discover/map" className="editorial-link">Open map <span aria-hidden>→</span></Link>
        </div>
        <Link to="/discover/map" className="discover-map-feature" aria-label="Open the discovery map">
          <div className="discover-map-heading">
            <div>
              <p className="eyebrow">Live discovery map</p>
              <strong>What’s unfolding nearby</strong>
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
