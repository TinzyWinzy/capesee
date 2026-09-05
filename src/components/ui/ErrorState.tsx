import { Button } from './Button'

export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  const offline = typeof navigator !== 'undefined' && !navigator.onLine
  return (
    <div className="state" role="alert" aria-live="assertive">
      <div className="state-icon" aria-hidden>{offline ? '◍' : '⚠'}</div>
      <div className="state-title">{offline ? "You're offline" : 'Could not load'}</div>
      <div className="state-desc">{message}</div>
      <div className="row" style={{ justifyContent: 'center', marginTop: 12, gap: 8 }}>
        {onRetry ? (
          <Button variant="primary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
      {offline ? <p className="text-faint text-xs" style={{ marginTop: 8 }}>Will retry automatically when you&apos;re back online.</p> : null}
    </div>
  )
}
