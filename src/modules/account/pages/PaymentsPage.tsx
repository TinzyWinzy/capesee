import { Badge, Card, EmptyState, ErrorState, SkeletonCard } from '@/components/ui'
import { useAsyncData } from '@/lib/useAsyncData'
import { formatDate, formatRand } from '@/lib/format'
import { fetchMyPayments } from '@/modules/account/api/account'

function toneFor(status: string): 'success' | 'danger' | 'info' | 'gold' {
  if (status === 'paid' || status === 'succeeded' || status === 'completed') return 'success'
  if (status === 'failed' || status === 'cancelled' || status === 'expired') return 'danger'
  if (status === 'pending' || status === 'initiated') return 'gold'
  return 'info'
}

export function PaymentsPage() {
  const { data, error, loading } = useAsyncData(() => fetchMyPayments(), [])

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>
        Payments
      </h1>

      {loading ? <SkeletonCard lines={2} /> : null}
      {error ? <ErrorState message={error.message} /> : null}

      {!loading && !error && data === null ? (
        <EmptyState
          icon="◇"
          title="Connect Supabase to see payments"
          description="Your payment history and Paynow handoffs will appear here."
        />
      ) : null}

      {!loading && !error && data && data.length === 0 ? (
        <Card>
          <p className="text-faint text-small">No payments yet. Payments appear after your first booking.</p>
        </Card>
      ) : null}

      {!loading && !error && data && data.length > 0 ? (
        <div className="stack">
          {data.map((payment) => (
            <Card key={payment.id} className="row-between">
              <div className="stack" style={{ gap: 2 }}>
                <span className="text-small bold">
                  {payment.bookingCode ?? 'Payment'} · {formatRand(payment.amount)}
                </span>
                <span className="text-faint text-xs">
                  {payment.provider} · {formatDate(payment.createdAt)}
                </span>
              </div>
              <Badge tone={toneFor(payment.status)}>{payment.status}</Badge>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
