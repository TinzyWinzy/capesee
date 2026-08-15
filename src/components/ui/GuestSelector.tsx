import { Button } from './Button'

export function GuestSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="row-between">
      <span>
        <span className="label" style={{ marginBottom: 0 }}>Guests</span>
      </span>
      <div className="row">
        <Button variant="outline" size="sm" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Fewer guests">
          −
        </Button>
        <span className="bold" style={{ minWidth: 24, textAlign: 'center' }}>{value}</span>
        <Button variant="outline" size="sm" onClick={() => onChange(value + 1)} aria-label="More guests">
          +
        </Button>
      </div>
    </div>
  )
}
