import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCheckoutStore } from '@/stores/checkout'
import { getSupabase } from '@/services/supabase/client'

/** T13 — Short confirmation state while the provider result becomes a booking. */
export function CheckoutProcessingPage() {
  const navigate = useNavigate()
  const simulated = useCheckoutStore((state) => state.simulated)
  const storedBookingId = useCheckoutStore((state) => state.bookingId)
  const setPaymentResult = useCheckoutStore((state) => state.setPaymentResult)
  const [takingLonger, setTakingLonger] = useState(false)

  useEffect(() => {
    if (simulated) {
      const timer = window.setTimeout(() => navigate({ to: '/checkout/success' }), 1400)
      return () => window.clearTimeout(timer)
    }

    const bookingId = new URLSearchParams(window.location.search).get('booking') ?? storedBookingId
    const supabase = getSupabase()
    if (!bookingId || !supabase) {
      setPaymentResult({ error: 'We could not identify the booking returned by the payment provider.' })
      navigate({ to: '/checkout/failed' })
      return
    }

    let active = true
    let attempts = 0
    const poll = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('code, status, payment_status, payment_reference')
        .eq('id', bookingId)
        .maybeSingle()
      if (!active) return
      if (error) {
        setPaymentResult({ error: 'We could not verify the payment status.' })
        navigate({ to: '/checkout/failed' })
        return
      }
      if (data?.payment_status === 'paid') {
        setPaymentResult({ bookingId, bookingCode: data.code, reference: data.payment_reference ?? undefined })
        navigate({ to: '/checkout/success' })
        return
      }
      if (data?.status === 'cancelled' || data?.payment_status === 'failed') {
        setPaymentResult({ bookingId, bookingCode: data.code, error: 'The payment was not completed.' })
        navigate({ to: '/checkout/failed' })
        return
      }
      attempts += 1
      if (attempts >= 20) {
        setTakingLonger(true)
        return
      }
      window.setTimeout(poll, 2000)
    }
    void poll()
    return () => { active = false }
  }, [navigate, setPaymentResult, simulated, storedBookingId])

  return (
    <main className="checkout-status-page" aria-live="polite">
      <div className="checkout-processing-mark" aria-hidden><span /></div>
      <p className="eyebrow">Confirming your trip</p>
      <h1>One moment while we prepare your booking.</h1>
      <p>Keep this page open. We’re matching the payment response to your Capesee itinerary.</p>
      {takingLonger ? <p role="status">Confirmation is taking longer than usual. Your reservation remains recorded; refresh this page to check again.</p> : null}
      <div className="checkout-processing-line"><span /></div>
    </main>
  )
}
