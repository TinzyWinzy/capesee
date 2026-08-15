import { Button } from './Button'

export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="state">
      <div className="state-icon">⚠</div>
      <div className="state-title">Could not load</div>
      <div className="state-desc">{message}</div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
