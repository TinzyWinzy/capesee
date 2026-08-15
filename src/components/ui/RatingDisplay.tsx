/** Star rating with optional review count. */
export function RatingDisplay({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="row" style={{ gap: 4 }}>
      <span style={{ color: 'var(--color-gold)' }} aria-hidden>
        ★
      </span>
      <span className="bold text-small">{rating.toFixed(1)}</span>
      {reviewCount !== undefined ? <span className="text-faint text-xs">{reviewCount} reviews</span> : null}
    </div>
  )
}
