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

export interface AdminBookingRow {
  id: string
  code: string
  status: string
  total: number
  travelerId: string
  travelerName: string
  guideId: string | null
  startsAt: string
  endsAt: string
  createdAt: string
}

export async function fetchAdminBookings(opts?: { status?: string; query?: string; limit?: number; offset?: number }): Promise<AdminBookingRow[]> {
  const supabase = getSupabase()
  if (!supabase) return []
  let q = supabase.from('bookings').select('id, code, status, total, traveler_id, traveler_details, assigned_guide_id, starts_at, ends_at, created_at').order('created_at', { ascending: false })
  if (opts?.status && opts.status !== 'All') q = q.eq('status', opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  if (opts?.offset) q = q.range(opts.offset, opts.offset + (opts.limit ?? 20) - 1)
  const { data, error } = await q
  if (error) throw error
  let rows = (data ?? []).map((b) => {
    const details = (b.traveler_details ?? {}) as Record<string, unknown>
    return {
      id: b.id,
      code: b.code,
      status: b.status,
      total: b.total,
      travelerId: b.traveler_id,
      travelerName: typeof details.fullName === 'string' ? details.fullName : (typeof details.full_name === 'string' ? details.full_name : 'Traveler'),
      guideId: b.assigned_guide_id,
      startsAt: b.starts_at,
      endsAt: b.ends_at,
      createdAt: b.created_at,
    } as AdminBookingRow
  })
  if (opts?.query) {
    const needle = opts.query.toLowerCase()
    rows = rows.filter(r => r.code.toLowerCase().includes(needle) || r.travelerName.toLowerCase().includes(needle))
  }
  return rows
}

export async function updateBookingGuide(bookingId: string, guideId: string | null): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase required')
  const { error } = await supabase.from('bookings').update({ assigned_guide_id: guideId }).eq('id', bookingId)
  if (error) throw error
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase required')
  const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId)
  if (error) throw error
}
