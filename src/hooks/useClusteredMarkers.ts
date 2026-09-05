import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchClusteredPlaces, type ClusterRow } from '@/services/maps/cluster'
import { useMapMarkers } from '@/modules/maps/hooks/useMapMarkers'

export interface ClusterMarker {
  id: string
  lat: number
  lng: number
  count: number
  isCluster: boolean
  label?: string
}

export function useClusteredMarkers(bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number } | null, zoom: number) {
  const fallback = useMapMarkers()
  const [clusters, setClusters] = useState<ClusterRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | null>(null)

  const fetch = useCallback(async (b: typeof bounds, z: number) => {
    if (!b) return
    setLoading(true)
    const rows = await fetchClusteredPlaces(b, z)
    // if RPC returns empty (no supabase), keep fallback
    if (rows.length > 0) setClusters(rows)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!bounds) return
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => fetch(bounds, zoom), 300)
    return () => { if (timer.current) window.clearTimeout(timer.current) }
  }, [bounds, zoom, fetch])

  if (!clusters) return { markers: fallback, isClustered: false, loading }
  const mapped: ClusterMarker[] = clusters.map((r, i) =>
    r.cluster_count > 1
      ? { id: `cluster-${i}`, lat: r.cluster_lat, lng: r.cluster_lng, count: r.cluster_count, isCluster: true }
      : { id: r.id!, lat: r.cluster_lat, lng: r.cluster_lng, count: 1, isCluster: false, label: r.place_name! }
  )
  return { markers: mapped, isClustered: true, loading }
}
