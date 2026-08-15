import type { Pin } from '@/types'
import { mockPins } from '@/lib/mock'
import { getPlaceBySlug } from '@/lib/mock'
import { getSupabase } from '@/services/supabase/client'

/**
 * Discovery / nearby queries (T02, T03).
 * TODO(Sprint 3): supabase.from('pins').select(...) filtered by radius,
 * with realtime subscription for new pins within bounds.
 */
export function getNearbyDiscoveries(radiusMeters = 5000): Pin[] {
  void radiusMeters
  return mockPins.filter((p) => p.status === 'approved' || p.status === 'pending')
}

export function getDiscoveriesForPlace(placeSlug: string): Pin[] {
  const place = getPlaceBySlug(placeSlug)
  if (!place) return []
  return mockPins.filter((p) => p.placeId === place.id)
}

export async function fetchDiscoveries(): Promise<Pin[]> {
  const supabase = getSupabase()
  if (!supabase) return getNearbyDiscoveries()

  const { data, error } = await supabase
    .from('discoveries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  const mediaPaths = data.flatMap((discovery) => discovery.photo_url ? [discovery.photo_url] : [])
  const signedMedia = new Map<string, string>()
  if (mediaPaths.length) {
    const { data: signed, error: signedError } = await supabase.storage
      .from('discovery-media')
      .createSignedUrls(mediaPaths, 3600)
    if (!signedError) {
      signed?.forEach((item) => {
        if (item.path && item.signedUrl) signedMedia.set(item.path, item.signedUrl)
      })
    }
  }
  return data.map((discovery) => ({
    id: discovery.id,
    placeId: discovery.place_id ?? undefined,
    authorName: 'Capesee traveler',
    title: discovery.title,
    description: discovery.description ?? undefined,
    category: discovery.category as Pin['category'],
    coordinates: { lat: discovery.latitude, lng: discovery.longitude },
    createdAt: discovery.created_at,
    status: discovery.status as Pin['status'],
    photoUrl: discovery.photo_url ? signedMedia.get(discovery.photo_url) : undefined,
    likes: discovery.likes_count,
    comments: discovery.comments_count,
  }))
}
