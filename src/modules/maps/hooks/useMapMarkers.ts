import { useMemo } from 'react'
import { mockPlaces } from '@/lib/mock'
import type { Pin } from '@/types'
import { getNearbyDiscoveries } from '@/modules/discover/api/discoveries'
import type { CATEGORIES } from '@/lib/constants'

export interface MapMarkerData {
  id: string
  category: (typeof CATEGORIES)[number]
  entityType: 'place' | 'discovery'
  slug?: string
  x: number
  y: number
  label: string
  context: string
  distanceMeters: number
  verified: boolean
}

/** Percent x/y marker positions for the mock map. Replace with lat/lng → Web Mercator projection when Mapbox lands. */
export function useMapMarkers(): MapMarkerData[] {
  return useMemo(() => {
    const placeMarkers: MapMarkerData[] = mockPlaces.map((p, i) => ({
      id: p.id,
      category: p.type === 'Historical Site' ? 'Historical site' : 'Place',
      entityType: 'place',
      slug: p.slug,
      x: 20 + i * 22,
      y: 30 + (i % 2) * 28,
      label: p.name,
      context: `${p.locationName} · ${p.type}`,
      distanceMeters: 900 + i * 1250,
      verified: p.verified,
    }))
    const pinMarkers: MapMarkerData[] = (getNearbyDiscoveries() as Pin[]).map((pin, i) => ({
      id: pin.id,
      category: pin.category === 'Wildlife' ? 'Wildlife' : pin.category === 'History' ? 'Historical site' : 'Food',
      entityType: 'discovery',
      x: 15 + i * 18,
      y: 55 + (i % 2) * 14,
      label: pin.title,
      context: `${pin.category} · ${pin.authorName}`,
      distanceMeters: 340 + i * 860,
      verified: false,
    }))
    return [...placeMarkers, ...pinMarkers]
  }, [])
}
