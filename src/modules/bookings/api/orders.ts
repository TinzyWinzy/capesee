import type { Booking } from '@/types'
import type { Json } from '@/types/database.generated'
import { mockBookings } from '@/lib/mock'
import { getSupabase } from '@/services/supabase/client'
import type { TravelerDetails } from '@/stores/checkout'

/**
 * Booking / order queries (T14–T15, guide, admin).
 * TODO(Sprint 2): supabase.from('bookings') with nested items; realtime for
 * status changes and driver location.
 */
export function getMyBookings(): Booking[] {
  return mockBookings
}

export function getBookingById(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id)
}

export function getAllBookings(): Booking[] {
  return mockBookings
}

function jsonObject(value: Json): Record<string, Json | undefined> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const supabase = getSupabase()
  if (!supabase) return getMyBookings()

  const { data, error } = await supabase
    .from('bookings')
    .select('*, booking_items(*)')
    .order('starts_at')

  if (error) throw error
  return data.map((booking) => {
    const details = jsonObject(booking.traveler_details)
    return {
      id: booking.id,
      code: booking.code,
      status: booking.status,
      total: booking.total,
      items: booking.booking_items.map((item) => ({
        productId: item.product_id ?? item.id,
        type: item.product_type as Booking['items'][number]['type'],
        qty: item.quantity,
        date: item.service_date ?? undefined,
      })),
      dates: { start: booking.starts_at, end: booking.ends_at },
      travelerId: booking.traveler_id,
      travelerName: typeof details.fullName === 'string' ? details.fullName : 'Traveler',
      guideId: booking.assigned_guide_id ?? undefined,
      regionSlug: typeof details.regionSlug === 'string' ? details.regionSlug : 'western-cape',
    }
  })
}

export async function fetchBookingById(id: string): Promise<Booking | undefined> {
  const bookings = await fetchMyBookings()
  return bookings.find((booking) => booking.id === id)
}

export interface CreatedBooking {
  id: string
  code: string
  total: number
  status: string
}

export async function createBooking(
  items: Array<{ productId: string; qty: number; date?: string }>,
  traveler: TravelerDetails,
  idempotencyKey: string,
): Promise<CreatedBooking> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Booking service is unavailable.')
  if (items.some((item) => !item.date)) throw new Error('Choose a service date for every item.')

  const { data, error } = await supabase.rpc('create_booking', {
    p_items: items,
    p_traveler_details: {
      ...traveler,
      fullName: `${traveler.firstName} ${traveler.lastName}`.trim(),
      regionSlug: 'western-cape',
    },
    p_idempotency_key: idempotencyKey,
  })
  if (error) {
    const known = error.message.match(/(insufficient_availability|product_or_slot_not_available|invalid_booking_item)/)?.[1]
    if (known === 'insufficient_availability') throw new Error('One of these experiences has just sold out.')
    if (known === 'product_or_slot_not_available') throw new Error('The selected date is no longer available.')
    throw new Error('We could not reserve this trip. Please review the dates and try again.')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid booking response.')
  return data as unknown as CreatedBooking
}
