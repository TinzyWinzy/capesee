import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge, EmptyState } from '@/components/ui'
import { getMyPins } from '@/modules/journal/api/journal'
import { formatDate } from '@/lib/format'

export const Route = createFileRoute('/_app/journal/feed')({ component: JournalFeedPage })

/** T17 — Community feed of traveler discoveries. Wireframe spec §19. */
function JournalFeedPage() {
  const pins = getMyPins().filter((pin) => pin.status === 'approved')

  return (
    <div className="page-narrow">
      <header className="feed-head">
        <div>
          <p className="eyebrow">Traveler feed</p>
          <h1 className="section-title">Community discoveries</h1>
        </div>
        <Link to="/journal/create" className="btn btn-primary btn-sm">+ Add yours</Link>
      </header>

      {pins.length === 0 ? (
        <EmptyState
          icon="◇"
          title="Nothing here yet"
          description="Approved traveler discoveries will appear here. Publish your first one to start the feed."
          action={<Link to="/journal/create" className="btn btn-primary">Publish a discovery</Link>}
        />
      ) : (
        <div className="feed-list">
          {pins.map((pin) => (
            <article key={pin.id} className="card feed-item">
              <div className="feed-item-head">
                <div className="feed-item-author">
                  <span className="avatar" aria-hidden>{pin.authorName.charAt(0)}</span>
                  <div>
                    <strong>{pin.authorName}</strong>
                    <small>{formatDate(pin.createdAt, { day: 'numeric', month: 'short' })}</small>
                  </div>
                </div>
                <Badge tone="accent">{pin.category}</Badge>
              </div>
              <h2 className="feed-item-title">{pin.title}</h2>
              {pin.description ? <p className="feed-item-body">{pin.description}</p> : null}
              <div className="feed-item-meta">
                <span aria-label={`${pin.likes} likes`}>◇ {pin.likes}</span>
                <span aria-label={`${pin.comments} comments`}>● {pin.comments}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
