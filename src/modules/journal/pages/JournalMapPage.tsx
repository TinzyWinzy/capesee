import { Link } from '@tanstack/react-router'
import { MapSurface } from '@/components/maps/MapSurface'
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

      <MapSurface
        style={{ minHeight: 300, marginTop: 12 }}
        markers={[
          ...pinnedPlaces.slice(0, 6).map((place) => ({
            id: place?.id,
            lat: place!.coordinates.lat,
            lng: place!.coordinates.lng,
            category: 'Place' as const,
            label: place?.name,
          })),
          ...pins.slice(0, 3).map((pin) => ({
            id: pin.id,
            lat: pin.coordinates.lat,
            lng: pin.coordinates.lng,
            category: toMarkerCategory(pin.category),
            label: pin.title,
          })),
        ]}
      />

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
