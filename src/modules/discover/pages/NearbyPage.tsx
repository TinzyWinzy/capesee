import { Link } from '@tanstack/react-router'
import { Button, DiscoveryCard, EmptyState } from '@/components/ui'
import { getNearbyDiscoveries } from '@/modules/discover/api/discoveries'
import { Seo } from '@/components/Seo'
import { useState } from 'react'

/** T03 — Nearby discoveries. Wireframe spec §5. */
export function NearbyPage() {
  const [radiusKm, setRadiusKm] = useState(5)
  const [filter, setFilter] = useState<string | null>(null)
  const pins = getNearbyDiscoveries(radiusKm * 1000).filter((p) => !filter || p.category === filter)

  return (
    <div className="page-narrow">
      <Seo
        title="Discoveries Near You"
        description="Live traveler discoveries near you across the Cape — wildlife sightings, history notes and local finds pinned to place. Filter by distance and category."
        canonical="/discover/nearby"
      />
      <div className="row-between">
        <Link to="/discover" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Discover Near Me</h1>
        <Link to="/discover/map" className="btn btn-outline btn-sm">
          Map View
        </Link>
      </div>

      <div className="row-between" style={{ marginTop: 12 }}>
        <span className="label" style={{ marginBottom: 0 }}>
          Within {radiusKm} km
        </span>
        <div className="row" style={{ gap: 6 }}>
          {[5, 10].map((r) => (
            <button key={r} className={radiusKm === r ? 'chip chip-active' : 'chip'} onClick={() => setRadiusKm(r)}>
              {r} km
            </button>
          ))}
        </div>
      </div>

      <div className="row wrap" style={{ margin: '12px 0' }}>
        {['Wildlife', 'History', 'Food', 'Experience'].map((c) => (
          <button key={c} className={filter === c ? 'chip chip-active' : 'chip'} onClick={() => setFilter(filter === c ? null : c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="stack">
        {pins.length === 0 ? (
          <EmptyState
            icon="✶"
            title="Nothing discovered nearby yet"
            description="Explore the area and become the first person to add something to Capesee."
            action={
              <Link to="/journal/create">
                <Button variant="primary">Add Discovery</Button>
              </Link>
            }
          />
        ) : (
          pins.map((pin) => <DiscoveryCard key={pin.id} pin={pin} />)
        )}
      </div>
    </div>
  )
}
