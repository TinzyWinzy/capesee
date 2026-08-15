import { Link } from '@tanstack/react-router'
import type { Place } from '@/types'
import { DiscoveryCard, SourceBadge, TourCard } from '@/components/ui'
import { getDiscoveriesForPlace } from '@/modules/discover/api/discoveries'
import { getProducts } from '@/modules/bookings/api/products'
import { getTimelineForPlace } from '@/modules/places/api/places'

/** T05 — Place overview: context, evidence, living reports, and a path into booking. */
export function PlaceOverviewPage({ place }: { place: Place }) {
  const timeline = getTimelineForPlace(place.id)
  const discoveries = getDiscoveriesForPlace(place.slug)
  const tours = getProducts('tour')

  return (
    <div className="place-overview">
      <section className="place-overview-intro">
        <div>
          <p className="eyebrow">About this place</p>
          <h2>A landmark read through place, people and time.</h2>
        </div>
        <p>{place.description}</p>
      </section>

      <aside className="place-location-card">
        <div className="place-mini-map" aria-hidden>
          <span className="place-mini-map-pin">⌖</span>
          <span className="place-mini-map-road" />
        </div>
        <div>
          <p className="eyebrow">Find it</p>
          <strong>{place.locationName}</strong>
          <small>{place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}</small>
        </div>
        <Link to="/discover/map">Explore the area <span aria-hidden>→</span></Link>
      </aside>

      <section className="place-history-preview">
        <div className="place-section-heading">
          <div>
            <p className="eyebrow">Historical record</p>
            <h2>What happened here</h2>
          </div>
          <Link to="/discover/places/$placeSlug/timeline" params={{ placeSlug: place.slug }} className="editorial-link">Full timeline →</Link>
        </div>
        <div className="place-history-track">
          {timeline.slice(0, 3).map((event, index) => (
            <article key={event.id} className="place-history-moment">
              <div className="place-history-index">0{index + 1}</div>
              <time>{event.year}</time>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              {event.sourceBacked ? <SourceBadge /> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="place-live-section">
        <div className="place-section-heading">
          <div>
            <p className="eyebrow">From travelers</p>
            <h2>What people are noticing now</h2>
          </div>
          <Link to="/discover/places/$placeSlug/discoveries" params={{ placeSlug: place.slug }} className="editorial-link">All discoveries →</Link>
        </div>
        {discoveries.length > 0 ? (
          <div className="place-discovery-grid">
            {discoveries.slice(0, 2).map((pin) => <DiscoveryCard key={pin.id} pin={pin} />)}
            <Link to="/journal/create" className="place-contribute-card">
              <span aria-hidden>＋</span>
              <strong>Add what you see</strong>
              <small>Your moderated report can help the next traveler understand this place.</small>
            </Link>
          </div>
        ) : (
          <div className="place-quiet-state">
            <span>No traveler reports here yet.</span>
            <Link to="/journal/create">Be the first to add one →</Link>
          </div>
        )}
      </section>

      <section className="place-experience-section">
        <div className="place-section-heading">
          <div>
            <p className="eyebrow">Continue through the Cape</p>
            <h2>Experiences connected to the region</h2>
          </div>
          <Link to="/book/tours" className="editorial-link">Browse all →</Link>
        </div>
        <div className="place-experience-grid">
          {tours.slice(0, 2).map((tour) => <TourCard key={tour.id} tour={tour} />)}
        </div>
      </section>

      <section className="place-evidence-callout">
        <div>
          <p className="eyebrow">How we know</p>
          <h2>History with its evidence attached.</h2>
          <p>Capesee separates source-backed historical records from moderated traveler observations, so you can understand where every story comes from.</p>
        </div>
        <div className="place-evidence-action">
          <SourceBadge count={place.sourceCount} />
          <Link to="/discover/places/$placeSlug/timeline" params={{ placeSlug: place.slug }}>Review the record <span aria-hidden>↗</span></Link>
        </div>
      </section>
    </div>
  )
}
