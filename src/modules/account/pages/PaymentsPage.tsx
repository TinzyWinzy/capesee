import { Card } from '@/components/ui'

export function PaymentsPage() {
  return (
    <div className="page-narrow">
      <h1 className="section-title" style={{ marginBottom: 14 }}>
        Payments
      </h1>
      <Card className="row-between">
        <span className="text-small bold">Paynow</span>
        <button className="btn btn-outline btn-sm">Add</button>
      </Card>
    </div>
  )
}
