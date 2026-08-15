import { Link, useNavigate } from '@tanstack/react-router'
import { EmptyState } from '@/components/ui'
import { formatDate, formatRand } from '@/lib/format'
import { mockExperiences, mockStays, mockTours, mockTransfers } from '@/lib/mock'
import { useCartStore } from '@/stores/cart'
import type { BookableProduct } from '@/types'

const CATALOG = [...mockTours, ...mockStays, ...mockTransfers, ...mockExperiences]

const LABEL: Record<BookableProduct['type'], string> = {
  tour: 'Guided experience',
  stay: 'Stay',
  transfer: 'Transfer',
  experience: 'Experience',
}

/** T12 — Persistent trip cart with quantity editing and checkout summary. */
export function CartPage() {
  const items = useCartStore((state) => state.items)
  const remove = useCartStore((state) => state.remove)
  const updateQty = useCartStore((state) => state.updateQty)
  const clear = useCartStore((state) => state.clear)
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <main className="trip-cart-shell empty-cart-shell">
        <EmptyState
          icon="◇"
          title="Your Cape trip starts here"
          description="Add an experience, stay or transfer and we’ll keep the details together."
          action={<Link to="/book/tours" className="btn btn-primary">Browse experiences</Link>}
        />
      </main>
    )
  }

  const resolved = items
    .map((item) => ({ item, product: CATALOG.find((product) => product.id === item.productId) }))
    .filter((entry): entry is { item: (typeof items)[number]; product: BookableProduct } => Boolean(entry.product))
  const total = resolved.reduce((sum, { item, product }) => sum + product.price * item.qty, 0)

  return (
    <main className="trip-cart-shell">
      <header className="trip-cart-header">
        <div>
          <p className="eyebrow">Your itinerary</p>
          <h1>Build your Cape trip.</h1>
          <p>Review each selection before moving into traveler details and payment.</p>
        </div>
        <Link to="/book" className="editorial-link">Continue exploring →</Link>
      </header>

      <div className="trip-cart-layout">
        <section className="trip-cart-items" aria-label="Trip selections">
          <div className="trip-cart-section-title"><span>{resolved.length} {resolved.length === 1 ? 'selection' : 'selections'}</span><button type="button" onClick={clear}>Clear trip</button></div>
          {resolved.map(({ item, product }, index) => (
            <article key={product.id} className="trip-cart-item">
              <div className={`trip-cart-art trip-cart-art-${product.type}`} aria-hidden><span>0{index + 1}</span></div>
              <div className="trip-cart-copy">
                <p className="eyebrow">{LABEL[product.type]}</p>
                <h2>{product.title}</h2>
                <div className="trip-cart-meta">
                  {item.date ? <span>{formatDate(item.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span> : null}
                  {product.durationHours ? <span>{product.durationHours} hours</span> : null}
                  <span>Western Cape</span>
                </div>
                <div className="trip-cart-edit-row">
                  <div className="cart-quantity" aria-label={`Guests for ${product.title}`}>
                    <button type="button" onClick={() => updateQty(product.id, item.qty - 1)} aria-label={`Fewer guests for ${product.title}`}>−</button>
                    <span>{item.qty} {item.qty === 1 ? 'guest' : 'guests'}</span>
                    <button type="button" onClick={() => updateQty(product.id, item.qty + 1)} aria-label={`More guests for ${product.title}`}>＋</button>
                  </div>
                  <button type="button" className="cart-remove" onClick={() => remove(product.id)}>Remove</button>
                </div>
              </div>
              <div className="trip-cart-price"><small>{formatRand(product.price)} each</small><strong>{formatRand(product.price * item.qty)}</strong></div>
            </article>
          ))}
        </section>

        <aside className="trip-order-summary">
          <p className="eyebrow">Trip summary</p>
          <dl>
            {resolved.map(({ item, product }) => <div key={product.id}><dt>{product.title} × {item.qty}</dt><dd>{formatRand(product.price * item.qty)}</dd></div>)}
            <div className="trip-order-total"><dt>Total</dt><dd>{formatRand(total)}</dd></div>
          </dl>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => navigate({ to: '/checkout/details' })}>Continue to checkout</button>
          <div className="trip-order-assurance"><span aria-hidden>◇</span><p><strong>Review before payment</strong>Traveler details and applicable terms come next.</p></div>
        </aside>
      </div>
    </main>
  )
}
