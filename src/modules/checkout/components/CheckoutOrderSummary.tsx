import { Link } from '@tanstack/react-router'
import { formatDate, formatRand } from '@/lib/format'
import { mockExperiences, mockStays, mockTours, mockTransfers } from '@/lib/mock'
import { useCartStore } from '@/stores/cart'

const CATALOG = [...mockTours, ...mockStays, ...mockTransfers, ...mockExperiences]

export function CheckoutOrderSummary({ compact = false }: { compact?: boolean }) {
  const items = useCartStore((state) => state.items)
  const resolved = items.flatMap((item) => {
    const product = CATALOG.find((candidate) => candidate.id === item.productId)
    return product ? [{ item, product }] : []
  })
  const total = resolved.reduce((sum, { item, product }) => sum + product.price * item.qty, 0)

  return (
    <aside className={compact ? 'checkout-order-summary is-compact' : 'checkout-order-summary'}>
      <div className="checkout-summary-heading">
        <p className="eyebrow">Trip summary</p>
        <Link to="/book/cart">Edit trip</Link>
      </div>
      <div className="checkout-summary-items">
        {resolved.map(({ item, product }) => (
          <div key={product.id} className="checkout-summary-item">
            <span className="checkout-summary-mark" aria-hidden>◇</span>
            <div><strong>{product.title}</strong><small>{item.date ? formatDate(item.date, { day: 'numeric', month: 'short', year: 'numeric' }) : product.type} · {item.qty} {item.qty === 1 ? 'guest' : 'guests'}</small></div>
            <span>{formatRand(product.price * item.qty)}</span>
          </div>
        ))}
      </div>
      <dl className="checkout-summary-total"><dt>Total</dt><dd>{formatRand(total)}</dd></dl>
    </aside>
  )
}
