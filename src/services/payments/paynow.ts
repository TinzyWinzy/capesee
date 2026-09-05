/**
 * Payment provider interface. Paynow is the first integration (Zimbabwe/South
 * Africa), others added behind this interface. Requires connectivity — never
 * queued offline. See spec §15 / T13.
 */
export interface PaymentIntent {
  bookingId: string
  idempotencyKey: string
}

export interface PaymentResult {
  ok: boolean
  reference?: string
  error?: string
  simulated?: boolean
  checkoutUrl?: string
}

export interface PaymentProvider {
  pay(intent: PaymentIntent): Promise<PaymentResult>
  /** Mobile money / card method selected by the traveler. */
  name: string
}

class PaynowProvider implements PaymentProvider {
  name = 'Paynow'

  async pay(intent: PaymentIntent): Promise<PaymentResult> {
    if (isPaymentSimulationEnabled()) {
      return { ok: true, reference: `DEMO-${intent.idempotencyKey.slice(-8).toUpperCase()}`, simulated: true }
    }
    const { getSupabase } = await import('@/services/supabase/client')
    const supabase = getSupabase()
    if (!supabase) return { ok: false, error: 'Payments are temporarily unavailable.' }
    const { data, error } = await supabase.functions.invoke('paynow-create', {
      body: { bookingId: intent.bookingId, idempotencyKey: intent.idempotencyKey },
    })
    if (error) return { ok: false, error: 'The secure payment provider could not be reached.' }
    if (!data?.checkoutUrl) return { ok: false, error: data?.error ?? 'The payment provider returned an invalid response.' }
    return { ok: true, reference: data.reference, checkoutUrl: data.checkoutUrl }
  }
}

class PayFastProvider implements PaymentProvider {
  name = 'PayFast'

  async pay(intent: PaymentIntent): Promise<PaymentResult> {
    if (isPaymentSimulationEnabled()) {
      return { ok: true, reference: `DEMO-${intent.idempotencyKey.slice(-8).toUpperCase()}`, simulated: true }
    }
    const { getSupabase } = await import('@/services/supabase/client')
    const supabase = getSupabase()
    if (!supabase) return { ok: false, error: 'Payments are temporarily unavailable.' }
    const { data, error } = await supabase.functions.invoke('payfast-create', {
      body: { bookingId: intent.bookingId, idempotencyKey: intent.idempotencyKey },
    })
    if (error) return { ok: false, error: 'The secure payment provider could not be reached.' }
    if (!data?.checkoutUrl) return { ok: false, error: data?.error ?? 'The payment provider returned an invalid response.' }
    return { ok: true, reference: data.reference, checkoutUrl: data.checkoutUrl }
  }
}

export function isPaymentSimulationEnabled() {
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_PAYMENT_SIMULATION === 'true'
}

export const providers: PaymentProvider[] = [new PayFastProvider(), new PaynowProvider()]
