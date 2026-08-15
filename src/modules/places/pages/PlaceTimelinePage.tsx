import { useState } from 'react'
import type { Place } from '@/types'
import { SourceBadge, TravelerReportBadge } from '@/components/ui'
import { getTimelineForPlace } from '@/modules/places/api/places'

type TimelineFilter = 'all' | 'history' | 'traveler'

/** T06 — Evidence-led place timeline with distinct historical and traveler provenance. */
export function PlaceTimelinePage({ place }: { place: Place }) {
  const allEvents = getTimelineForPlace(place.id)
  const [filter, setFilter] = useState<TimelineFilter>('all')
  const [selectedId, setSelectedId] = useState(allEvents[0]?.id ?? '')
  const events = allEvents.filter((event) => filter === 'all' || event.kind === filter)
  const selected = events.find((event) => event.id === selectedId) ?? events[0]

  return (
    <div className="place-timeline-page">
      <header className="timeline-intro">
        <div>
          <p className="eyebrow">Through time</p>
          <h2>The record of {place.name}</h2>
        </div>
        <p>Historical events are linked to evidence. Contemporary observations remain clearly marked as traveler reports.</p>
      </header>

      <div className="timeline-filter-bar" aria-label="Filter timeline">
        {([
          ['all', 'Complete record'],
          ['history', 'Historical records'],
          ['traveler', 'Traveler reports'],
        ] as const).map(([key, label]) => (
          <button key={key} type="button" className={filter === key ? 'is-active' : ''} aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="timeline-workspace">
        <div className="timeline-record">
          {events.map((event) => {
            const active = event.id === selected?.id
            return (
              <article key={event.id} className={`timeline-record-event ${event.kind} ${active ? 'is-active' : ''}`}>
                <div className="timeline-record-year"><time>{event.year}</time></div>
                <button type="button" className="timeline-record-content" onClick={() => setSelectedId(event.id)} aria-expanded={active}>
                  <span className="timeline-record-type">{event.kind === 'history' ? 'Historical record' : 'Traveler observation'}</span>
                  <strong>{event.title}</strong>
                  <p>{event.description}</p>
                  <span className="timeline-record-trust">
                    {event.kind === 'history' ? <SourceBadge /> : <TravelerReportBadge />}
                    <span>{active ? 'Evidence shown' : 'Inspect record'} <span aria-hidden>→</span></span>
                  </span>
                </button>
              </article>
            )
          })}
        </div>

        <aside className="timeline-evidence-panel" aria-live="polite">
          {selected ? (
            <>
              <div className="timeline-evidence-topline">
                <span className="eyebrow">Provenance</span>
                <span className={selected.kind === 'history' ? 'evidence-state verified' : 'evidence-state traveler'}>
                  {selected.kind === 'history' ? 'Verified record' : 'Moderated report'}
                </span>
              </div>
              <time>{selected.year}</time>
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
              <dl className="timeline-evidence-facts">
                <div><dt>Record type</dt><dd>{selected.kind === 'history' ? 'Historical' : 'Traveler observation'}</dd></div>
                <div><dt>Publication</dt><dd>{selected.status}</dd></div>
                <div><dt>Evidence</dt><dd>{selected.sourceBacked ? `${place.sourceCount} linked place sources` : 'Traveler-submitted observation'}</dd></div>
              </dl>
              <div className="timeline-evidence-note">
                <span aria-hidden>{selected.sourceBacked ? '◈' : '✶'}</span>
                <p>{selected.sourceBacked ? 'This statement belongs to Capesee’s source-backed historical record.' : 'This observation passed moderation but is not presented as independently verified history.'}</p>
              </div>
              {selected.sourceBacked ? <button type="button" className="btn btn-outline btn-block">View linked evidence</button> : null}
            </>
          ) : (
            <div className="place-quiet-state">No records match this filter.</div>
          )}
        </aside>
      </div>
    </div>
  )
}
