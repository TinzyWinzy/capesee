import { Link } from '@tanstack/react-router'
import { useCheckoutStore } from '@/stores/checkout'

/** T13 — Recoverable provider failure; trip selections remain intact. */
export function CheckoutFailedPage() {
  const error = useCheckoutStore((state) => state.paymentError)

  return (
    <main className="checkout-status-page checkout-failed-page">
      <div className="checkout-failed-mark" aria-hidden>!</div>
      <p className="eyebrow">Payment incomplete</p>
      <h1>Your trip is still saved.</h1>
      <p>{error ?? 'The payment provider did not confirm the transaction.'} No confirmed charge has been recorded by Capesee.</p>
      <div className="checkout-provider-note"><span aria-hidden>↺</span><p><strong>Nothing has been lost</strong>Your traveler details and trip selections remain available while you try again or choose another method.</p></div>
      <div className="checkout-success-actions">
        <Link to="/checkout/payment" className="btn btn-primary btn-lg">Try payment again</Link>
        <Link to="/book/cart" className="btn btn-outline btn-lg">Return to trip</Link>
      </div>
    </main>
  )
}
