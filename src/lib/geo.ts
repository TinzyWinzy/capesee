/**
 * Geographic helpers shared by the map surfaces. Pure functions — no Google
 * Maps dependency, so the same projection and bounds logic drives both the
 * live map and the no-key mock fallback.
 */

export interface LatLng {
  lat: number
  lng: number
}

export interface Bounds {
  sw: LatLng
  ne: LatLng
}

/** Default Cape Peninsula viewport used when there is nothing to fit. */
export const CAPE_DEFAULT_BOUNDS: Bounds = {
  sw: { lat: -34.05, lng: 18.32 },
  ne: { lat: -33.76, lng: 18.58 },
}

/** Web Mercator Y (0..1, 0 = north) for a latitude. */
export function webMercatorY(lat: number): number {
  const clamped = Math.max(-85, Math.min(85, lat))
  return (1 - Math.log(Math.tan(Math.PI / 4 + (clamped * Math.PI) / 360)) / Math.PI) / 2
}

/** Projects a lat/lng to a 0..100 percentage inside the given bounds. */
export function projectLatLng(lat: number, lng: number, bounds: Bounds): { x: number; y: number } {
  const minX = (bounds.sw.lng + 180) / 360
  const maxX = (bounds.ne.lng + 180) / 360
  const minY = webMercatorY(bounds.ne.lat)
  const maxY = webMercatorY(bounds.sw.lat)
  const x = (((lng + 180) / 360 - minX) / (maxX - minX)) * 100
  const y = ((webMercatorY(lat) - minY) / (maxY - minY)) * 100
  return { x, y }
}

/** Padded bounds that cover all the given points, or the Cape default when empty. */
export function fitBounds(points: LatLng[], padRatio = 0.15): Bounds {
  if (points.length === 0) return CAPE_DEFAULT_BOUNDS
  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const point of points) {
    minLat = Math.min(minLat, point.lat)
    maxLat = Math.max(maxLat, point.lat)
    minLng = Math.min(minLng, point.lng)
    maxLng = Math.max(maxLng, point.lng)
  }
  let padLat: number
  let padLng: number
  if (maxLat === minLat && maxLng === minLng) {
    padLat = 0.05
    padLng = 0.05
  } else {
    padLat = (maxLat - minLat) * padRatio
    padLng = (maxLng - minLng) * padRatio
  }
  return {
    sw: { lat: minLat - padLat, lng: minLng - padLng },
    ne: { lat: maxLat + padLat, lng: maxLng + padLng },
  }
}

/** Great-circle distance between two points in kilometres. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const radiusKm = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * radiusKm * Math.asin(Math.sqrt(s))
}
