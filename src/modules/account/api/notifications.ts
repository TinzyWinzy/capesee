import type { Tables } from '@/types/database.generated'
import { getSupabase } from '@/services/supabase/client'

export interface UserNotification {
  id: string
  channel: string
  template: string
  status: string
  createdAt: string
  payload: Record<string, unknown>
}

export async function fetchMyNotifications(): Promise<UserNotification[]> {
  const supabase = getSupabase()
  if (!supabase) return []
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('notification_outbox')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error

  return data.map((row: Tables<'notification_outbox'>) => ({
    id: row.id,
    channel: row.channel,
    template: row.template,
    status: row.status,
    createdAt: row.created_at,
    payload: typeof row.payload === 'object' && row.payload !== null && !Array.isArray(row.payload) ? row.payload : {},
  }))
}

const TEMPLATE_LABELS: Record<string, string> = {
  booking_confirmed: 'Booking confirmed',
  booking_cancelled: 'Booking cancelled',
  discovery_approved: 'Discovery approved',
  discovery_rejected: 'Discovery needs changes',
  claim_approved: 'Historical claim approved',
  payment_succeeded: 'Payment received',
  payment_failed: 'Payment failed',
}

export function notificationLabel(template: string): string {
  return TEMPLATE_LABELS[template] ?? template.replace(/_/g, ' ')
}
