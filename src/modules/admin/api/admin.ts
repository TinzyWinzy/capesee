import type { Tables } from '@/types/database.generated'
import { getSupabase } from '@/services/supabase/client'

export interface AdminStats {
  revenue: number
  gmv: number
  bookings: number
  travelers: number
  pins: number
  pendingDiscoveries: number
  unassignedBookings: number
  cancelledBookings: number
}

export async function fetchAdminStats(): Promise<AdminStats | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const [bookingsResult, travelersResult, pinsResult, pendingResult, unassignedResult, cancelledResult] = await Promise.all([
    supabase.from('bookings').select('total, status', { count: 'exact' }),
    supabase.from('bookings').select('traveler_id', { count: 'exact', head: true }),
    supabase.from('discoveries').select('id', { count: 'exact', head: true }),
    supabase.from('discoveries').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).is('assigned_guide_id', null),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'cancelled'),
  ])

  const bookings = bookingsResult.error ? [] : (bookingsResult.data ?? [])
  const gmv = bookings.reduce((sum, booking) => sum + booking.total, 0)
  const revenue = bookings
    .filter((booking) => booking.status !== 'cancelled')
    .reduce((sum, booking) => sum + booking.total, 0)

  return {
    revenue,
    gmv,
    bookings: bookingsResult.count ?? 0,
    travelers: travelersResult.count ?? 0,
    pins: pinsResult.count ?? 0,
    pendingDiscoveries: pendingResult.count ?? 0,
    unassignedBookings: unassignedResult.count ?? 0,
    cancelledBookings: cancelledResult.count ?? 0,
  }
}

export interface PaymentLedgerRow {
  id: string
  createdAt: string
  provider: string
  bookingId: string
  bookingCode: string | null
  amount: number
  currency: string
  status: string
  reference: string | null
  failureReason: string | null
}

export async function fetchPaymentLedger(limit = 100): Promise<PaymentLedgerRow[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('payment_attempts')
    .select('*, bookings(code)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error

  return data.map((row) => {
    const booking = (row as unknown as { bookings: Pick<Tables<'bookings'>, 'code'> | null }).bookings
    return {
      id: row.id,
      createdAt: row.created_at,
      provider: row.provider,
      bookingId: row.booking_id,
      bookingCode: booking?.code ?? null,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      reference: row.provider_reference,
      failureReason: row.failure_reason,
    }
  })
}

export interface AuditLogRow {
  id: number
  createdAt: string
  action: string
  actorId: string | null
  entityType: string
  entityId: string
}

export async function fetchAuditLog(limit = 50): Promise<AuditLogRow[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase.from('audit_events').select('*').order('created_at', { ascending: false }).limit(limit)
  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    action: row.action,
    actorId: row.actor_id,
    entityType: row.entity_type,
    entityId: row.entity_id,
  }))
}

export interface StaffProfile {
  id: string
  fullName: string
  phone: string | null
  createdAt: string
}

export async function fetchStaffProfiles(): Promise<StaffProfile[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error

  return data.map((profile) => ({
    id: profile.id,
    fullName: profile.full_name,
    phone: profile.phone,
    createdAt: profile.created_at,
  }))
}
