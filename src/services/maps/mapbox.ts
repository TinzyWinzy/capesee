/**
 * Mapbox loader. Returns the access token from env. A real Mapbox GL
 * integration (services/maps/MapView) replaces the mock MapSurface once
 * VITE_MAPBOX_ACCESS_TOKEN is set. See spec §4 / T02.
 */
export function getMapboxToken(): string | undefined {
  return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined
}

/** Not wired yet: marker clustering and geocoding land with the real map. */
export async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  const token = getMapboxToken()
  if (!token) return null
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}`,
  )
  if (!res.ok) return null
  const data = (await res.json()) as { features?: Array<{ center: [number, number] }> }
  const feature = data.features?.[0]
  return feature ? { lng: feature.center[0], lat: feature.center[1] } : null
}
