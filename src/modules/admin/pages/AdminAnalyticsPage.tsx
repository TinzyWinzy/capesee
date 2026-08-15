import { Card } from '@/components/ui'

/** A10 — Analytics. Three metric layers from spec §36. */
export function AdminAnalyticsPage() {
  return (
    <div className="stack">
      <h1 className="section-title">Analytics</h1>

      {(
        [
          ['Revenue', ['Bookings', 'GMV', 'Net revenue', 'Average booking value', 'Cancellation rate']],
          ['Destination engagement', ['Map sessions', 'Place views', 'Pins created', 'Timeline interactions', 'Search-to-place conversion']],
          ['Conversion', ['Place → Experience', 'Experience → Cart', 'Cart → Checkout', 'Checkout → Booking']],
        ] as const
      ).map(([group, metrics]) => (
        <Card key={group} className="stack">
          <span className="eyebrow">{group}</span>
          {metrics.map((m) => (
            <div key={m} className="row-between">
              <span className="text-small">{m}</span>
              <span className="text-faint text-small">—</span>
            </div>
          ))}
        </Card>
      ))}

      <Card className="stack">
        <span className="eyebrow">Headline metric</span>
        <div className="row-between">
          <span className="bold text-small">DISCOVERY-ASSISTED BOOKING RATE</span>
          <Badge value="Not wired" />
        </div>
        <p className="text-faint text-xs" style={{ margin: 0 }}>
          Bookings that followed a discovery, place timeline or map interaction. This is the metric that proves the discovery layer drives commerce.
        </p>
      </Card>
    </div>
  )
}

function Badge({ value }: { value: string }) {
  return <span className="badge badge-gold">{value}</span>
}
