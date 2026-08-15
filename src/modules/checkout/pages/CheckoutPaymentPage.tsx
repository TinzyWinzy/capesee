import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckoutOrderSummary } from '@/modules/checkout/components/CheckoutOrderSummary'
import { useCheckoutTotal } from '@/modules/checkout/hooks/useCheckoutTotal'
import { formatRand } from '@/lib/format'
import { isPaymentSimulationEnabled, providers } from '@/services/payments/paynow'
import { useCheckoutStore, type CheckoutPaymentMethod } from '@/stores/checkout'
import { useCartStore } from '@/stores/cart'
import { createBooking } from '@/modules/bookings/api/orders'

const METHODS: Array<{ key: CheckoutPaymentMethod; name: string; note: string }> = [
  { key: 'paynow', name: 'Paynow', note: 'Continue through the configured payment provider.' },
  { key: 'card', name: 'Debit or credit card', note: 'Card entry will be hosted by the live payment provider.' },
]

/** T13 step 2 — Provider selection without collecting raw payment credentials. */
export function CheckoutPaymentPage() {
  const navigate = useNavigate()
  const total = useCheckoutTotal()
  const method = useCheckoutStore((state) => state.paymentMethod)
  const setMethod = useCheckoutStore((state) => state.setPaymentMethod)
  const setPaymentResult = useCheckoutStore((state) => state.setPaymentResult)
  const traveler = useCheckoutStore((state) => state.traveler)
  const cartItems = useCartStore((state) => state.items)
  const [busy, setBusy] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const pay = async () => {
    setBusy(true)
    const idempotencyKey = crypto.randomUUID()
    try {
      if (isPaymentSimulationEnabled()) {
        const result = await providers[0].pay({ bookingId: 'development-simulation', idempotencyKey })
        setPaymentResult({ reference: result.reference, error: result.error, simulated: true })
        navigate({ to: result.ok ? '/checkout/processing' : '/checkout/failed' })
        return
      }
      const booking = await createBooking(cartItems, traveler, idempotencyKey)
      const result = await providers[0].pay({ bookingId: booking.id, idempotencyKey: `${idempotencyKey}:paynow` })
      setPaymentResult({ reference: result.reference, error: result.error, bookingId: booking.id, bookingCode: booking.code })
      if (result.ok && result.checkoutUrl) {
        window.location.assign(result.checkoutUrl)
        return
      }
      navigate({ to: '/checkout/failed' })
    } catch (error) {
      setPaymentResult({ error: error instanceof Error ? error.message : 'Booking could not be completed.' })
      navigate({ to: '/checkout/failed' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page-heading"><p className="eyebrow">Step two</p><h1>Complete your booking.</h1><p>Choose how you’d like to continue. Payment credentials are handled by the payment provider, not stored by Capesee.</p></div>
      <div className="checkout-layout-grid">
        <section className="checkout-payment-form">
          <fieldset className="checkout-payment-methods">
            <legend>Payment method</legend>
            {METHODS.map((option) => (
              <label key={option.key} className={method === option.key ? 'checkout-payment-option is-active' : 'checkout-payment-option'}>
                <input type="radio" name="payment-method" checked={method === option.key} onChange={() => setMethod(option.key)} />
                <span className="checkout-payment-radio" aria-hidden />
                <span><strong>{option.name}</strong><small>{option.note}</small></span>
                <span className="checkout-payment-mark" aria-hidden>{option.key === 'paynow' ? 'P' : '◇'}</span>
              </label>
            ))}
          </fieldset>

          <div className="checkout-provider-note">
            <span aria-hidden>◇</span>
            <p><strong>Secure provider handoff</strong>In production, you’ll be redirected to the configured provider to enter payment details and authenticate the transaction.</p>
          </div>

          <label className="checkout-consent"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span>I have reviewed the trip details and understand the applicable cancellation terms.</span></label>
          <button type="button" className="btn btn-primary btn-lg btn-block" disabled={busy || total === 0 || !termsAccepted} onClick={pay}>{busy ? 'Preparing secure payment…' : `Continue with ${formatRand(total)}`}</button>
          {isPaymentSimulationEnabled() ? <p className="checkout-demo-note">Prototype mode: this confirms the interface flow without creating a real charge.</p> : null}
        </section>
        <CheckoutOrderSummary />
      </div>
    </main>
  )
}
