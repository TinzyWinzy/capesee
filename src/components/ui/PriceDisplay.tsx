import { formatRand } from '@/lib/format'

/** Shows a price and its unit, e.g. "R1,250/person" or "From R950". */
export function PriceDisplay({ amount, unit, prefix = 'From' }: { amount: number; unit?: string; prefix?: string }) {
  return (
    <div className="row" style={{ alignItems: 'baseline', gap: 4 }}>
      <span className="text-faint text-small">{prefix}</span>
      <span className="bold" style={{ fontSize: 17 }}>
        {formatRand(amount)}
      </span>
      {unit ? <span className="text-faint text-small">{unit}</span> : null}
    </div>
  )
}
