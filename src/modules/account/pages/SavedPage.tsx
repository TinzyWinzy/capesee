import { Card } from '@/components/ui'

export function SavedPage() {
  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>
        Saved
      </h1>
      <Card>
        <p className="text-faint text-small">
          Places you save appear here so you can find them again — and get notified when their history grows.
        </p>
      </Card>
    </div>
  )
}
