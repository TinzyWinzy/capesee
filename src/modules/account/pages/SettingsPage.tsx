import { Card } from '@/components/ui'

/** Account settings — stub list. */
export function SettingsPage() {
  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>
        Settings
      </h1>
      <div className="stack">
        {['Language', 'Currency', 'Offline downloads', 'Notifications'].map((s) => (
          <Card key={s} className="row-between">
            <span className="text-small bold">{s}</span>
            <span className="text-faint text-small">▸</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
