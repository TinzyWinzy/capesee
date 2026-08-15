import type { Place } from '@/types'
import { DiscoveryCard } from '@/components/ui'
import { getDiscoveriesForPlace } from '@/modules/discover/api/discoveries'

/** Place discoveries tab — live traveler reports attached to a place. */
export function PlaceDiscoveriesPage({ place }: { place: Place }) {
  const discoveries = getDiscoveriesForPlace(place.slug)
  return (
    <div className="stack" style={{ gap: 10 }}>
      {discoveries.map((pin) => (
        <DiscoveryCard key={pin.id} pin={pin} showBadge />
      ))}
    </div>
  )
}
