import { Card } from '@/components/ui'

export function PrivacyPage() {
  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>
        Privacy
      </h1>
      <Card className="stack">
        {['Public journal', 'Show my discoveries on the map', 'Location sharing'].map((p) => (
          <label key={p} className="row-between">
            <span className="text-small">{p}</span>
            <input type="checkbox" />
          </label>
        ))}
      </Card>
    </div>
  )
}
