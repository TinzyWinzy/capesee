import { Link, Outlet, useRouterState } from '@tanstack/react-router'

const STEPS = [
  { key: 'details', label: 'Traveler details' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmation', label: 'Confirmation' },
] as const

/** Focused checkout shell with an explicit three-step trust path. */
export function CheckoutLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const stepIndex = pathname.includes('/payment') ? 1 : pathname.includes('/processing') || pathname.includes('/success') || pathname.includes('/failed') ? 2 : 0

  return (
    <div className="checkout-shell">
      <header className="checkout-topbar">
        <Link to="/discover" className="brand">CAPE<span>SEE</span></Link>
        <Link to="/book/cart">← Return to trip</Link>
        <span className="checkout-secure-note"><span aria-hidden>◇</span> Secure checkout</span>
      </header>
      <div className="checkout-progress" aria-label="Checkout progress">
        {STEPS.map((step, index) => (
          <div key={step.key} className={index <= stepIndex ? 'checkout-progress-step is-active' : 'checkout-progress-step'} aria-current={index === stepIndex ? 'step' : undefined}>
            <span>{index < stepIndex ? '✓' : index + 1}</span>
            <strong>{step.label}</strong>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
