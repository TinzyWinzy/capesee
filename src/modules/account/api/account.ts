import { getSupabase } from '@/services/supabase/client'

export interface SavedPlace {
  placeId: string
  name: string
  slug: string
  locationName: string
  type: string
  coverUrl?: string
}

export interface PaymentRecord {
  id: string
  bookingCode: string | null
  provider: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

/** Saved places for the signed-in traveler. Null when no live backend. */
export async function fetchMySavedPlaces(): Promise<SavedPlace[] | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('saved_places')
    .select(
      'place_id, places:place_id(name, slug, location_name, place_type, cover_url)',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row) => {
    const place = row.places as unknown as {
      name: string
      slug: string
      location_name: string
      place_type: string
      cover_url?: string | null
    }
    return {
      placeId: row.place_id,
      name: place.name,
      slug: place.slug,
      locationName: place.location_name,
      type: place.place_type,
      coverUrl: place.cover_url ?? undefined,
    }
  })
}

export async function removeSavedPlace(placeId: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from('saved_places').delete().eq('place_id', placeId).eq('user_id', user.id)
  if (error) throw error
}

/** Payment attempts for the signed-in traveler. Null when no live backend. */
export async function fetchMyPayments(): Promise<PaymentRecord[] | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('payment_attempts')
    .select('id, amount, currency, provider, status, created_at, bookings:booking_id(code, traveler_id)')
    .eq('bookings.traveler_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? [])
    .map((row) => ({
      id: row.id,
      bookingCode: (row.bookings as unknown as { code: string } | null)?.code ?? null,
      provider: row.provider,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      createdAt: row.created_at,
    }))
}

