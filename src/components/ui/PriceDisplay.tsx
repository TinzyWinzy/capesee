import { formatRand } from '@/lib/format'

/** Shows a price and its unit, e.g. "R1,250/person" or "R4,500/group". */
export function PriceDisplay({ amount, unit, groupSize, prefix = 'From' }: { amount: number; unit?: string; groupSize?: number | null; prefix?: string }) {
  const unitLabel = unit === 'group' ? (groupSize ? `/ group (up to ${groupSize})` : '/ group — private tour') : unit
  return (
    <div className="row" style={{ alignItems: 'baseline', gap: 4 }}>
      <span className="text-faint text-small">{prefix}</span>
      <span className="bold" style={{ fontSize: 17 }}>
        {formatRand(amount)}
      </span>
      {unitLabel ? <span className="text-faint text-small">{unitLabel}</span> : null}
    </div>
  )
}
