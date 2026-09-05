import {
  mockBookings,
  mockExperiences,
  mockPins,
  mockPlaces,
  mockStays,
  mockTimeline,
  mockTours,
  mockTransfers,
} from '@/lib/mock'
import { fetchDiscoveries } from '@/modules/discover/api/discoveries'
import { fetchProducts } from '@/modules/bookings/api/products'
import { fetchMyBookings } from '@/modules/bookings/api/orders'
import { fetchPlaces, fetchTimeline } from '@/modules/places/api/places'
import { getSupabase } from './client'

/**
 * Hydrates the existing synchronous screen adapters from Supabase before the
 * router renders. Cache-first: Dexie provides instant paint offline, then
 * Supabase syncs and refreshes Dexie.
 */
export async function hydrateCatalog() {
  // 1) Instant paint from Dexie cache if available
  try {
    const { db } = await import('@/services/offlineDb')
    const [placesCached, productsCached, discoveriesCached, timelineCached] = await Promise.all([
      db.places.toArray(),
      db.products.toArray(),
      db.discoveries.toArray(),
      db.timeline.toArray(),
    ])
    if (placesCached.length > 0) {
      mockPlaces.splice(0, mockPlaces.length, ...(placesCached as unknown as typeof mockPlaces))
      mockTimeline.splice(0, mockTimeline.length, ...(timelineCached as unknown as typeof mockTimeline))
      mockPins.splice(0, mockPins.length, ...(discoveriesCached as unknown as typeof mockPins))
      const tours = productsCached.filter((p) => (p as { type: string }).type === 'tour')
      const stays = productsCached.filter((p) => (p as { type: string }).type === 'stay')
      const transfers = productsCached.filter((p) => (p as { type: string }).type === 'transfer')
      const exps = productsCached.filter((p) => (p as { type: string }).type === 'experience')
      mockTours.splice(0, mockTours.length, ...(tours as unknown as typeof mockTours))
      mockStays.splice(0, mockStays.length, ...(stays as unknown as typeof mockStays))
      mockTransfers.splice(0, mockTransfers.length, ...(transfers as unknown as typeof mockTransfers))
      mockExperiences.splice(0, mockExperiences.length, ...(exps as unknown as typeof mockExperiences))
    }
  } catch {
    // Dexie unavailable (SSR/old browser) — fall through to network
  }

  if (!getSupabase()) return

  // 2) Network sync — also populates Dexie for next offline load
  try {
    const places = await fetchPlaces()
    const [products, discoveries, timelines] = await Promise.all([
      fetchProducts(),
      fetchDiscoveries(),
      fetchTimeline(),
    ])

    mockPlaces.splice(0, mockPlaces.length, ...places)
    mockTimeline.splice(0, mockTimeline.length, ...timelines)
    mockPins.splice(0, mockPins.length, ...discoveries)
    mockTours.splice(0, mockTours.length, ...products.filter((product) => product.type === 'tour'))
    mockStays.splice(0, mockStays.length, ...products.filter((product) => product.type === 'stay'))
    mockTransfers.splice(0, mockTransfers.length, ...products.filter((product) => product.type === 'transfer'))
    mockExperiences.splice(0, mockExperiences.length, ...products.filter((product) => product.type === 'experience'))

    // persist to Dexie for offline
    try {
      const { db, putAll, setMeta } = await import('@/services/offlineDb')
      await db.transaction('rw', db.places, db.products, db.discoveries, db.timeline, async () => {
        await putAll(db.places, places as never)
        await putAll(db.products, products as never)
        await putAll(db.discoveries, discoveries as never)
        await putAll(db.timeline, timelines as never)
      })
      await setMeta('lastSyncAt', new Date().toISOString())
    } catch {
      // cache write is best-effort
    }

    mockBookings.splice(0, mockBookings.length)
  } catch (e) {
    console.warn('[Capesee] hydrateCatalog network failed — using Dexie cache', e)
  }
}

export async function hydrateUserBookings() {
  const supabase = getSupabase()
  if (!supabase) return

  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    mockBookings.splice(0, mockBookings.length)
    return
  }

  const bookings = await fetchMyBookings()
  mockBookings.splice(0, mockBookings.length, ...bookings)
}
