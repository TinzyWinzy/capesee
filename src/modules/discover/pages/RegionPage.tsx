import { Link } from '@tanstack/react-router'
import { Card, PlaceholderPage, PlaceCard, DiscoveryCard } from '@/components/ui'
import { getPlacesByRegion } from '@/modules/places/api/places'
import { REGIONS } from '@/lib/constants'
import { mockPins } from '@/lib/mock'

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

      <div className="media ratio-16-9" style={{ margin: '10px 0 14px' }}>
        <span>{region.name} — hero photography</span>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        {['Places', 'Tours', 'Stays', 'Experiences'].map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <h2 className="section-title">Top places</h2>
      <div className="grid-2">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      <div className="row-between" style={{ marginTop: 20 }}>
        <h2 className="section-title">Live discoveries</h2>
      </div>
      <div className="stack">
        {mockPins.slice(0, 1).map((pin) => (
          <DiscoveryCard key={pin.id} pin={pin} />
        ))}
      </div>

      <Link to="/discover/map" className="btn btn-outline btn-block" style={{ marginTop: 18 }}>
        Explore {region.name} on map →
      </Link>
    </div>
  )
}
