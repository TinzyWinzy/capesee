import { Link, useNavigate } from '@tanstack/react-router'
import { DiscoveryCard, Icon, SearchBar, TourCard } from '@/components/ui'
import { MapSurface } from '@/components/maps/MapSurface'
import { MapMarker } from '@/components/maps/MapMarker'
import { REGIONS } from '@/lib/constants'
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
          <div className="discover-regions" aria-label="Explore by region">
            <span className="text-xs text-faint">Explore</span>
            {REGIONS.map((r) => (
              <Link key={r.slug} to="/discover/regions/$regionSlug" params={{ regionSlug: r.slug }}>
                {r.name}<span aria-hidden>↗</span>
              </Link>
            ))}
          </div>
          <div className="expedition-rule" aria-hidden>
            <span className="hairline l" />
            <span className="diamond" />
            <span className="coord">34°00′S · 18°28′E</span>
            <span className="hairline r" />
          </div>
          <dl className="discover-field-index" aria-label="What Capesee connects">
            <div><dt>01</dt><dd>Place</dd></div>
            <div><dt>02</dt><dd>Living reports</dd></div>
            <div><dt>03</dt><dd>Local experience</dd></div>
          </dl>
        </div>

        <Link to="/discover/map" className="discover-map-feature" aria-label="Open the discovery map">
          <div className="discover-map-heading">
            <div>
              <p className="eyebrow">Live discovery map</p>
              <strong>What’s unfolding nearby</strong>
            </div>
            <span className="live-stamp"><span className="live-dot" aria-hidden />LIVE</span>
          </div>
          <MapSurface myLocation={{ x: 48, y: 74 }} className="discover-map-canvas">
            <MapMarker category="Place" x={27} y={43} label="Wine farm" />
            <MapMarker category="Traveler discovery" x={61} y={31} label="New sighting" />
            <MapMarker category="Historical site" x={78} y={61} label="Heritage" />
          </MapSurface>
          <div className="discover-map-note">
            <span className="live-dot" aria-hidden />
            Traveler reports and verified places, updated as the Cape changes.
            <span className="map-open-action">Open map <Icon name="arrow" /></span>
          </div>
        </Link>
      </section>

      <div className="discover-content">
        <section className="discover-section nearby-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 01 — From the field</p>
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

        <section className="discover-section experience-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">No. 02 — Go deeper</p>
              <h2>Experiences rooted in place</h2>
            </div>
            <Link to="/book/tours" className="editorial-link">Explore all <span aria-hidden>→</span></Link>
          </div>
          <div className="experience-layout">
            {mockTours.slice(0, 2).map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        </section>
      </div>
    </main>
  )
}
