import type { Place } from '@/types'
import { MediaGrid } from '@/components/media/MediaGrid'

/** Place media tab — photos/videos from Capesee and travelers. */
export function PlaceMediaPage({ place }: { place: Place }) {
  return (
    <MediaGrid
      items={[
        { id: 'm1', label: `${place.name} main view`, kind: 'photo' },
        { id: 'm2', label: 'Traveler photo', kind: 'photo' },
        { id: 'm3', label: 'Drone footage', kind: 'video' },
        { id: 'm4', label: 'Aerial view', kind: 'photo' },
        { id: 'm5', label: '1980 archive', kind: 'photo' },
      ]}
    />
  )
}
