import { Link } from '@tanstack/react-router'
import { MapSurface } from '@/components/maps/MapSurface'
import { MapMarker } from '@/components/maps/MapMarker'
import { getMyPins } from '@/modules/journal/api/journal'
import { getPlaceById } from '@/lib/mock'
import { CATEGORIES } from '@/lib/constants'

const MARKER_CATEGORIES = CATEGORIES as readonly string[]

const toMarkerCategory = (category: string): (typeof CATEGORIES)[number] =>
  MARKER_CATEGORIES.includes(category) ? (category as (typeof CATEGORIES)[number]) : 'Traveler discovery'

/** T18 — Journal map. Personal visited/captured places. Foundation for gamification. Wireframe spec §20. */
export function JournalMapPage() {
  const pins = getMyPins()

  const pinnedPlaces = Array.from(
    new Map(pins.filter((pin) => pin.placeId).map((pin) => [pin.placeId, getPlaceById(pin.placeId as string)]))
      .values(),
  ).filter((place) => place !== undefined)

  const stats = [
    [String(pinnedPlaces.length), 'places'],
    [String(new Set(pins.map((pin) => pin.category)).size), 'categories'],
    [String(pins.length), 'discoveries'],
    [String(new Set(pinnedPlaces.map((place) => place?.locationName)).size), 'towns'],
  ] as const

  return (
    <div className="page-narrow">
      <div className="row">
        <Link to="/journal" className="btn btn-ghost btn-sm" aria-label="Back">
          ←
        </Link>
        <h1 className="section-title">Your Cape Map</h1>
      </div>

      <MapSurface style={{ minHeight: 300, marginTop: 12 }} myLocation={{ x: 55, y: 70 }}>
        {pinnedPlaces.slice(0, 6).map((place, index) => (
          <MapMarker
            key={place?.id}
            category="Place"
            x={25 + index * 12}
            y={35 + index * 8}
            label={place?.name}
          />
        ))}
        {pins.slice(0, 3).map((pin, index) => (
          <MapMarker key={pin.id} category={toMarkerCategory(pin.category)} x={30 + index * 22} y={55 + index * 5} label={pin.title} />
        ))}
      </MapSurface>

      <div className="grid-2" style={{ marginTop: 14 }}>
        {stats.map(([n, label]) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: 18 }}>
            <div className="bold" style={{ fontSize: 24, color: 'var(--color-accent-strong)' }}>
              {n}
            </div>
            <div className="text-faint text-xs uppercase">{label}</div>
          </div>
        ))}
      </div>
      <p className="text-faint text-xs" style={{ marginTop: 10 }}>
        Counts reflect the discoveries currently on the map. User-scoped travel stats arrive with traveler profiles (Sprint 3).
      </p>
    </div>
  )
}
