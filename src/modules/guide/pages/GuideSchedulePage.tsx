import { Card } from '@/components/ui'

/** Guide weekly schedule. */
export function GuideSchedulePage() {
  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>
        Schedule
      </h1>
      <div className="stack">
        {['Mon 11', 'Tue 12', 'Wed 13', 'Thu 14'].map((d, i) => (
          <Card key={d} className="row-between">
            <span className="bold text-small">{d}</span>
            <span className="text-faint text-small">{i === 0 ? '3 jobs' : '1 job'}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
