import { Link, useNavigate } from '@tanstack/react-router'
import { DiscoveryCard, Icon, SearchBar, TourCard } from '@/components/ui'
import { MapSurface } from '@/components/maps/MapSurface'
import { MapMarker } from '@/components/maps/MapMarker'
import { REGIONS } from '@/lib/constants'
import { mockPins, mockTours } from '@/lib/mock'
import { useAuthStore } from '@/stores/auth'

/** T01 — Landing / Discover Home. Wireframe spec §3. */
export function DiscoverHomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const initials = user?.fullName?.charAt(0) ?? '?'
  const nearbyPins = mockPins.slice(0, 2)

  return (
    <main className="discover-home">
      <section className="discover-hero">
        <div className="discover-atlas-lines" aria-hidden />
        <div className="discover-mobile-brand mobile-only">
          <Link to="/discover" className="brand">CAPE<span>SEE</span></Link>
          <Link to={user ? '/account/profile' : '/auth/login'} className="avatar" aria-label="Profile">{initials}</Link>
        </div>

        <div className="discover-hero-copy">
          <p className="eyebrow discover-kicker">Your field guide to the Cape</p>
          <h1>See the Cape<br />beyond the postcard.</h1>
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
            <Link to="/discover/nearby" className="btn btn-ink">Explore nearby <Icon name="arrow" /></Link>
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
            <span className="map-open-action">Open map <Icon name="arrow" /></span>
          </div>
          <MapSurface myLocation={{ x: 48, y: 74 }} className="discover-map-canvas">
            <MapMarker category="Place" x={27} y={43} label="Wine farm" />
            <MapMarker category="Traveler discovery" x={61} y={31} label="New sighting" />
            <MapMarker category="Historical site" x={78} y={61} label="Heritage" />
          </MapSurface>
          <div className="discover-map-note">
            <span className="live-dot" aria-hidden />
            Traveler reports and verified places, updated as the Cape changes.
          </div>
        </Link>
      </section>

      <div className="discover-content">
        <section className="discover-section nearby-section">
          <div className="discover-section-heading">
            <div>
              <p className="eyebrow">From the field</p>
              <h2>Happening near you</h2>
            </div>
            <Link to="/discover/nearby" className="editorial-link">View nearby <span aria-hidden>→</span></Link>
          </div>
          <div className={`discover-card-row discovery-row${nearbyPins.length === 0 ? ' is-empty' : ''}`}>
            {nearbyPins.map((pin) => (
              <DiscoveryCard key={pin.id} pin={pin} distanceMeters={340 + mockPins.indexOf(pin) * 860} />
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
              <p className="eyebrow">Go deeper</p>
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
