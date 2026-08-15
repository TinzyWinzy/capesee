import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { CheckoutOrderSummary } from '@/modules/checkout/components/CheckoutOrderSummary'
import { useCheckoutStore, type TravelerDetails } from '@/stores/checkout'

/** T13 step 1 — Validated lead traveler and operational details. */
export function CheckoutDetailsPage() {
  const navigate = useNavigate()
  const storedTraveler = useCheckoutStore((state) => state.traveler)
  const setTraveler = useCheckoutStore((state) => state.setTraveler)
  const [traveler, setLocalTraveler] = useState<TravelerDetails>(storedTraveler)

  const update = (field: keyof TravelerDetails, value: string) => setLocalTraveler((current) => ({ ...current, [field]: value }))
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTraveler(traveler)
    navigate({ to: '/checkout/payment' })
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page-heading"><p className="eyebrow">Step one</p><h1>Who is traveling?</h1><p>We’ll use these details for your confirmation, ticket and day-of-trip updates.</p></div>
      <div className="checkout-layout-grid">
        <form className="checkout-form" onSubmit={submit}>
          <section className="checkout-form-section">
            <div className="checkout-section-number">01</div>
            <div className="checkout-section-content">
              <h2>Lead traveler</h2>
              <p>Enter the name exactly as it should appear on the booking.</p>
              <div className="checkout-form-grid">
                <label><span className="label">First name</span><input className="input" autoComplete="given-name" value={traveler.firstName} onChange={(event) => update('firstName', event.target.value)} required /></label>
                <label><span className="label">Last name</span><input className="input" autoComplete="family-name" value={traveler.lastName} onChange={(event) => update('lastName', event.target.value)} required /></label>
                <label><span className="label">Email</span><input className="input" type="email" autoComplete="email" placeholder="you@example.com" value={traveler.email} onChange={(event) => update('email', event.target.value)} required /></label>
                <label><span className="label">Mobile / WhatsApp</span><input className="input" type="tel" autoComplete="tel" placeholder="+27 71 000 0000" value={traveler.phone} onChange={(event) => update('phone', event.target.value)} required /></label>
              </div>
            </div>
          </section>

          <section className="checkout-form-section">
            <div className="checkout-section-number">02</div>
            <div className="checkout-section-content">
              <h2>Trip arrangements</h2>
              <p>Optional information helps the local team prepare.</p>
              <label><span className="label">Pickup location</span><input className="input" placeholder="Hotel or meeting point" value={traveler.pickupLocation} onChange={(event) => update('pickupLocation', event.target.value)} /></label>
              <label><span className="label">Dietary, accessibility or other needs</span><textarea className="textarea" value={traveler.requirements} onChange={(event) => update('requirements', event.target.value)} placeholder="Tell us anything useful for the experience team." /></label>
            </div>
          </section>

          <label className="checkout-consent"><input type="checkbox" required /><span>I confirm these traveler details are correct and I agree to review the booking terms before payment.</span></label>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Continue to payment</button>
        </form>
        <CheckoutOrderSummary />
      </div>
    </main>
  )
}
