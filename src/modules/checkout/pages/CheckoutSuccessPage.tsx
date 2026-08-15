import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { OfflineBadge } from '@/components/ui'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'

/** T13 — Booking confirmation and operational next steps. */
export function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clear)
  const traveler = useCheckoutStore((state) => state.traveler)
  const reference = useCheckoutStore((state) => state.paymentReference)
  const simulated = useCheckoutStore((state) => state.simulated)
  const confirmedBookingCode = useCheckoutStore((state) => state.bookingCode)
  const bookingCode = simulated ? reference?.replace(/^DEMO-/, '') ?? 'Prototype' : confirmedBookingCode ?? 'Pending provider sync'

  useEffect(() => clearCart(), [clearCart])

  return (
    <main className="checkout-status-page checkout-success-page">
      <div className="checkout-success-mark" aria-hidden>✓</div>
      <p className="eyebrow">{simulated ? 'Prototype completed' : 'Booking confirmed'}</p>
      <h1>Your Cape trip is ready{traveler.firstName ? `, ${traveler.firstName}` : ''}.</h1>
      <p>{simulated ? 'The complete checkout interface has been verified without creating a booking or charging a payment method.' : `Confirmation details are associated with booking ${bookingCode}.`}</p>
      {simulated ? <div className="checkout-demo-banner"><strong>Prototype confirmation</strong>No real payment was taken. Connect the live provider before production transactions.</div> : null}
      <div className="checkout-confirmation-card">
        <div><span>Booking</span><strong>{bookingCode}</strong></div>
        <div><span>Payment reference</span><strong>{reference ?? 'Pending provider sync'}</strong></div>
        <div><span>Status</span><strong>{simulated ? 'Prototype only' : 'Confirmed'}</strong></div>
      </div>
      <div className="checkout-success-actions">
        {simulated ? (
          <>
            <Link to="/book" className="btn btn-primary btn-lg">Continue exploring</Link>
            <Link to="/discover" className="btn btn-outline btn-lg">Return to Discover</Link>
          </>
        ) : (
          <Link to="/trips" className="btn btn-primary btn-lg">Open my trips</Link>
        )}
      </div>
      <OfflineBadge />
    </main>
  )
}
