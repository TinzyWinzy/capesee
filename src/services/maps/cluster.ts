import { getSupabase } from '@/services/supabase/client'

export interface ClusterRow {
  cluster_count: number
  cluster_lat: number
  cluster_lng: number
  id: string | null
  place_name: string | null
  slug: string | null
  place_type: string | null
}

export async function fetchClusteredPlaces(bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }, zoom: number): Promise<ClusterRow[]> {
  const supabase = getSupabase()
  if (!supabase) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('get_clustered_places', {
    min_lat: bounds.minLat,
    max_lat: bounds.maxLat,
    min_lng: bounds.minLng,
    max_lng: bounds.maxLng,
    zoom_level: Math.round(zoom),
  })
  if (error) {
    console.warn('[Capesee] get_clustered_places failed', (error as { message: string }).message)
    return []
  }
  return (data as ClusterRow[]) ?? []
}

export async function fetchNearbyPlaces(lat: number, lng: number, radiusM = 10000) {
  const supabase = getSupabase()
  if (!supabase) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('nearby_places', { user_lat: lat, user_lng: lng, radius_meters: radiusM })
  if (error) {
    console.warn('[Capesee] nearby_places failed', (error as { message: string }).message)
    return []
  }
  return (data as unknown[]) ?? []
}
