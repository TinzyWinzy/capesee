import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui'
import { getProducts } from '@/modules/bookings/api/products'

/** Admin tours list. */
export function AdminToursPage() {
  const tours = getProducts('tour')
  return (
    <div className="stack">
      <div className="row-between">
        <h1 className="section-title">Tours</h1>
        <Link to="/admin/tours/new" className="btn btn-primary btn-sm">
          + New Tour
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((t) => (
            <tr key={t.id}>
              <td>
                <Link to="/admin/tours/$tourId" params={{ tourId: t.id }} className="bold text-small">
                  {t.title}
                </Link>
              </td>
              <td>{t.price}</td>
              <td>{t.rating}</td>
              <td>
                <Badge tone="success">Published</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
