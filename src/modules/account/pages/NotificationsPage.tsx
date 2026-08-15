import { useState } from 'react'
import { Card, EmptyState, SkeletonCard } from '@/components/ui'
import { useAsyncData } from '@/lib/useAsyncData'
import { fetchMyNotifications, notificationLabel } from '@/modules/account/api/notifications'
import { formatDate } from '@/lib/format'

/** Notification centre — reads the real outbox for the signed-in traveler. */
export function NotificationsPage() {
  const { data: notifications, error, loading } = useAsyncData(() => fetchMyNotifications(), [])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const visible = (notifications ?? []).filter((n) => !dismissed.has(n.id))

  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>Notifications</h1>

      {loading ? <SkeletonCard lines={3} /> : null}
      {error ? <p className="alert alert-error" role="alert">{error.message}</p> : null}
      {!loading && !error && visible.length === 0 ? (
        <EmptyState
          icon="◌"
          title="Nothing to see yet"
          description="Trip, discovery and booking updates will land here."
        />
      ) : null}
      {!loading && !error && visible.length > 0 ? (
        <div className="stack">
          {visible.map((notification) => (
            <Card key={notification.id}>
              <div className="row-between">
                <span className="badge badge-accent">{notificationLabel(notification.template)}</span>
                <span className="text-faint text-xs">{formatDate(notification.createdAt)}</span>
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                <span className="text-faint text-xs">{notification.channel}</span>
                <span className={`badge ${notification.status === 'sent' ? 'badge-success' : 'badge-default'}`}>{notification.status}</span>
              </div>
              <button
                type="button"
                className="text-small text-accent"
                style={{ marginTop: 10, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                onClick={() => setDismissed((current) => new Set(current).add(notification.id))}
              >
                Dismiss
              </button>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
