import { Link } from '@tanstack/react-router'
import { MapSurface } from '@/components/maps/MapSurface'
import { MapMarker } from '@/components/maps/MapMarker'

/** T18 — Journal map. Personal visited/captured places. Foundation for gamification. Wireframe spec §20. */
export function JournalMapPage() {
  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/journal" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Your Cape Map</h1>
      </div>

      <MapSurface style={{ minHeight: 300, marginTop: 12 }} myLocation={{ x: 55, y: 70 }}>
        <MapMarker category="Place" x={30} y={40} label="Cape Town" />
        <MapMarker category="Place" x={62} y={30} label="Stellenbosch" />
        <MapMarker category="Traveler discovery" x={80} y={55} label="Whale sighting" />
        <MapMarker category="Food" x={44} y={62} label="Vineyard lunch" />
      </MapSurface>

      <div className="grid-2" style={{ marginTop: 14 }}>
        {(
          [
            ['12', 'places'],
            ['4', 'towns'],
            ['27', 'discoveries'],
            ['2', 'provinces'],
          ] as const
        ).map(([n, label]) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: 18 }}>
            <div className="bold" style={{ fontSize: 24, color: 'var(--color-accent-strong)' }}>
              {n}
            </div>
            <div className="text-faint text-xs uppercase">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
