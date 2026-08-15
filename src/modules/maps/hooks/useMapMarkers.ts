import { useMemo } from 'react'
import { mockPlaces } from '@/lib/mock'
import type { Pin } from '@/types'
import { getNearbyDiscoveries } from '@/modules/discover/api/discoveries'
import type { CATEGORIES } from '@/lib/constants'
import { haversineKm } from '@/lib/geo'

/** Reference point used for "distance from you" labels and the radius filter. */
const CAPE_CENTER = { lat: -33.9249, lng: 18.4241 }

export interface MapMarkerData {
  id: string
  category: (typeof CATEGORIES)[number]
  entityType: 'place' | 'discovery'
  slug?: string
  lat: number
  lng: number
  label: string
  context: string
  distanceMeters: number
  verified: boolean
}

/** Real lat/lng markers for the discovery map, with distances measured from Cape Town. */
export function useMapMarkers(): MapMarkerData[] {
  return useMemo(() => {
    const placeMarkers: MapMarkerData[] = mockPlaces.map((p) => ({
      id: p.id,
      category: p.type === 'Historical Site' ? 'Historical site' : 'Place',
      entityType: 'place',
      slug: p.slug,
      lat: p.coordinates.lat,
      lng: p.coordinates.lng,
      label: p.name,
      context: `${p.locationName} · ${p.type}`,
      distanceMeters: Math.round(haversineKm(CAPE_CENTER, p.coordinates) * 1000),
      verified: p.verified,
    }))
    const pinMarkers: MapMarkerData[] = (getNearbyDiscoveries() as Pin[]).map((pin) => ({
      id: pin.id,
      category: pin.category === 'Wildlife' ? 'Wildlife' : pin.category === 'History' ? 'Historical site' : 'Food',
      entityType: 'discovery',
      lat: pin.coordinates.lat,
      lng: pin.coordinates.lng,
      label: pin.title,
      context: `${pin.category} · ${pin.authorName}`,
      distanceMeters: Math.round(haversineKm(CAPE_CENTER, pin.coordinates) * 1000),
      verified: false,
    }))
    return [...placeMarkers, ...pinMarkers]
  }, [])
}
