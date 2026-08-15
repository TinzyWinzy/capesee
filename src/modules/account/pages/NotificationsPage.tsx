import { Card } from '@/components/ui'

/** Notification centre — categories from spec §45. */
export function NotificationsPage() {
  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>
        Notifications
      </h1>
      <div className="stack">
        {[
          ['Trips', 'Your driver is 10 minutes away.'],
          ['Discoveries', 'Your discovery was approved.'],
          ['Nearby', '3 new discoveries near Hermanus.'],
          ['Bookings', 'Your booking has been confirmed.'],
          ['System', 'New historical context added to a place you visited.'],
        ].map(([cat, msg]) => (
          <Card key={cat}>
            <span className="badge badge-accent">{cat}</span>
            <p className="text-small" style={{ marginTop: 6, marginBottom: 0 }}>
              {msg}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
