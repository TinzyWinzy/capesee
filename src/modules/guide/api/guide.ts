import type { Json } from '@/types/database.generated'
import { getSupabase } from '@/services/supabase/client'

export interface GuideAssignment {
  id: string
  code: string
  startsAt: string
  endsAt: string
  status: string
  travelerName: string
  guestCount: number
  items: Array<{ type: string; qty: number }>
}

function travelerName(details: Json): string {
  const value = details && typeof details === 'object' && !Array.isArray(details) ? (details as Record<string, unknown>) : {}
  return typeof value.fullName === 'string' ? value.fullName : 'Traveler'
}

/** Bookings assigned to the signed-in guide, from today forward. */
export async function fetchGuideAssignments(from = new Date()): Promise<GuideAssignment[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*, booking_items(product_type, quantity)')
    .eq('assigned_guide_id', authData.user.id)
    .gte('starts_at', from.toISOString())
    .order('starts_at')
    .limit(30)
  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    code: row.code,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    travelerName: travelerName(row.traveler_details),
    guestCount: row.booking_items.reduce((sum, item) => sum + item.quantity, 0),
    items: row.booking_items.map((item) => ({ type: item.product_type, qty: item.quantity })),
  }))
}
