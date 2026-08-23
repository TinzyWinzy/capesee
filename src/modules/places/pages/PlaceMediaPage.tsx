import type { Place } from '@/types'
import { MediaGrid } from '@/components/media/MediaGrid'

/** Place media tab — photos/videos from Capesee and travelers. */
export function PlaceMediaPage({ place }: { place: Place }) {
  return (
    <MediaGrid
      items={[
        { id: 'm1', label: `${place.name} main view`, kind: 'photo', url: place.coverUrl || '/images/IMG-20260823-WA0114.jpg' },
        { id: 'm2', label: 'Chapman\'s Peak Lookout', kind: 'photo', url: '/images/IMG-20260823-WA0153.jpg' },
        { id: 'm3', label: 'Tokara Estate Orchard Walk', kind: 'photo', url: '/images/IMG-20260823-WA0179.jpg' },
        { id: 'm4', label: 'Camps Bay Sunset', kind: 'photo', url: '/images/IMG-20260823-WA0141.jpg' },
        { id: 'm5', label: 'Stellenbosch Oaks & Lawn', kind: 'photo', url: '/images/IMG-20260823-WA0192.jpg' },
        { id: 'm6', label: 'Suspension Bridge Walkway', kind: 'photo', url: '/images/IMG-20260823-WA0173.jpg' },
      ]}
    />
  )
}

