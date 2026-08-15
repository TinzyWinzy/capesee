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
 * router renders. This keeps the current UI stable while removing production
 * dependence on bundled fixture data.
 */
export async function hydrateCatalog() {
  if (!getSupabase()) return

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

  // Never show fixture bookings when a real backend is configured.
  mockBookings.splice(0, mockBookings.length)
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
