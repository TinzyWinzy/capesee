import { Link } from '@tanstack/react-router'
import { Card, PlaceholderPage, PlaceCard, DiscoveryCard, EmptyState } from '@/components/ui'
import { getPlacesByRegion } from '@/modules/places/api/places'
import { REGIONS } from '@/lib/constants'
import { getPlaceById, mockPins } from '@/lib/mock'

/** T04 index — region list. */
export function RegionListPage() {
  return (
    <div className="page">
      <h1 className="section-title" style={{ fontSize: 20, marginBottom: 12 }}>
        Regions
      </h1>
      <div className="grid-2">
        {REGIONS.map((region) => (
          <Link key={region.slug} to="/discover/regions/$regionSlug" params={{ regionSlug: region.slug }}>
            <Card className="card-link">
              <div className="eyebrow">Region</div>
              <div className="section-title">{region.name}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

/** T04 — Region detail. Wireframe spec §6. */
export function RegionPage({ regionSlug }: { regionSlug: string }) {
  const region = REGIONS.find((r) => r.slug === regionSlug)
  if (!region) return <PlaceholderPage title="Unknown region" description={`No region matches "${regionSlug}".`} />

  const places = getPlacesByRegion(regionSlug)
  const regionPins = mockPins.filter((pin) => pin.placeId && getPlaceById(pin.placeId)?.regionSlug === regionSlug)

  return (
    <div className="page">
      <div className="row">
        <Link to="/discover/regions" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title" style={{ fontSize: 22 }}>
          {region.name}
        </h1>
      </div>

      <div className="media ratio-16-9 media-fallback" style={{ margin: '10px 0 14px' }}>
        <span>{region.name} — hero photography</span>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <Link to="/book/tours" className="chip">Tours</Link>
        <Link to="/book/stays" className="chip">Stays</Link>
        <Link to="/book/experiences" className="chip">Experiences</Link>
        <Link to="/discover/nearby" className="chip">Nearby</Link>
      </div>

      <h2 className="section-title">Top places</h2>
      {places.length === 0 ? (
        <EmptyState icon="▦" title="No places yet" description="Places for this region are being documented." />
      ) : (
        <div className="grid-2">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}

      <div className="row-between" style={{ marginTop: 20 }}>
        <h2 className="section-title">Live discoveries</h2>
      </div>
      {regionPins.length === 0 ? (
        <p className="text-faint text-small">No discoveries reported here yet.</p>
      ) : (
        <div className="stack">
          {regionPins.map((pin) => (
            <DiscoveryCard key={pin.id} pin={pin} />
          ))}
        </div>
      )}

      <Link to="/discover/map" className="btn btn-outline btn-block" style={{ marginTop: 18 }}>
        Explore {region.name} on map →
      </Link>
    </div>
  )
}
