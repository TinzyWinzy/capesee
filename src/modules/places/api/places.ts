import type { Place, TimelineEvent } from '@/types'
import type { Tables } from '@/types/database.generated'
import { getPlaceBySlug, mockPlaces, mockTimeline } from '@/lib/mock'
import { getSupabase } from '@/services/supabase/client'

/**
 * Place queries. Contract in docs/supabase-api-contract.md §place.
 * TODO(Sprint 1): replace bodies with supabase.from('places').select(...).
 */

export function getPlace(slug: string): Place | undefined {
  return getPlaceBySlug(slug)
}

export function getPlaces(): Place[] {
  return mockPlaces
}

export function getPlacesByRegion(regionSlug: string): Place[] {
  return mockPlaces.filter((p) => p.regionSlug === regionSlug)
}

export function getTimelineForPlace(placeId: string): TimelineEvent[] {
  return mockTimeline.filter((e) => e.placeId === placeId)
}

type PlaceCatalogRow = Tables<'places'> & {
  regions: Pick<Tables<'regions'>, 'slug'>
  timeline_events: Array<{ id: string }>
  discoveries: Array<{ id: string }>
  products: Array<{ id: string }>
}

function mapPlace(row: PlaceCatalogRow): Place {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    regionSlug: row.regions.slug,
    type: row.place_type,
    locationName: row.location_name,
    coordinates: { lat: row.latitude, lng: row.longitude },
    description: row.description,
    rating: row.rating,
    verified: row.verified,
    timelineCount: row.timeline_events.length,
    pinCount: row.discoveries.length,
    experienceCount: row.products.length,
    sourceCount: row.timeline_events.filter(() => true).length,
    coverUrl: row.cover_url ?? undefined,
  }
}

/** Live catalog query. Existing screens retain mock fallback until their loaders migrate. */
export async function fetchPlaces(): Promise<Place[]> {
  const supabase = getSupabase()
  if (!supabase) return getPlaces()

  const { data, error } = await supabase
    .from('places')
    .select('*, regions!inner(slug), timeline_events(id), discoveries(id), products(id)')
    .order('name')

  if (error) throw error
  return (data as PlaceCatalogRow[]).map(mapPlace)
}

export async function fetchPlace(slug: string): Promise<Place | undefined> {
  const places = await fetchPlaces()
  return places.find((place) => place.slug === slug)
}

export async function fetchTimelineForPlace(placeId: string): Promise<TimelineEvent[]> {
  const timeline = await fetchTimeline()
  return timeline.filter((event) => event.placeId === placeId)
}

export async function fetchTimeline(): Promise<TimelineEvent[]> {
  const supabase = getSupabase()
  if (!supabase) return mockTimeline

  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('place_id')
    .order('event_year')

  if (error) throw error
  return data.map((event) => ({
    id: event.id,
    placeId: event.place_id,
    year: event.event_year,
    title: event.title,
    description: event.description,
    kind: event.event_kind as TimelineEvent['kind'],
    sourceBacked: event.source_backed,
    confidence: event.confidence ?? undefined,
    status: event.status,
  }))
}

export async function createPlace(input: { name: string; slug: string; regionSlug: string; place_type: string; location_name: string; latitude: number; longitude: number; description: string; summary: string; cover_url?: string | null }): Promise<string> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase required to create places')
  const { data: region, error: rErr } = await supabase.from('regions').select('id').eq('slug', input.regionSlug).maybeSingle()
  if (rErr) throw rErr
  if (!region) throw new Error(`Region "${input.regionSlug}" not found — seed regions first`)
  const { data, error } = await supabase.from('places').insert({
    name: input.name,
    slug: input.slug,
    region_id: region.id,
    place_type: input.place_type,
    location_name: input.location_name,
    latitude: input.latitude,
    longitude: input.longitude,
    description: input.description,
    summary: input.summary,
    cover_url: input.cover_url ?? null,
    status: 'draft',
  }).select('id').single()
  if (error) throw error
  return data.id
}

export async function uploadPlaceCover(file: File): Promise<string> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase required for upload')
  const ext = file.name.split('.').pop() ?? 'jpg'
  const key = `places/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`
  const { error } = await supabase.storage.from('place-media').upload(key, file, { contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage.from('place-media').getPublicUrl(key)
  return data.publicUrl
}
