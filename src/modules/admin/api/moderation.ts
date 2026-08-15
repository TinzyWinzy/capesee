import type { Pin } from '@/types'
import { mockPins } from '@/lib/mock'
import { getSupabase } from '@/services/supabase/client'

/** Moderation queue (A06). */
export function getModerationQueue(): Pin[] {
  return mockPins.filter((p) => p.status === 'pending')
}

export async function moderateDiscovery(id: string, decision: 'approved' | 'rejected', note?: string) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Moderation service is unavailable.')
  const { error } = await supabase.rpc('moderate_discovery', {
    p_discovery_id: id,
    p_decision: decision,
    p_note: note,
  })
  if (error) throw new Error(error.message)
  const pin = mockPins.find((item) => item.id === id)
  if (pin) pin.status = decision
}
