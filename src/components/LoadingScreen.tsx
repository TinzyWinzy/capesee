export function LoadingScreen() {
  return (
    <main
      className="loading-screen"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading Capesee"
    >
      <div className="loading-shell">
        <div className="loading-brand">
          <span className="loading-mark" aria-hidden>
            <span className="loading-mark-ring" />
            <span className="loading-mark-core">C</span>
          </span>
          <span className="loading-wordmark">
            CAPE<span>SEE</span>
          </span>
          <span className="loading-coord" aria-hidden>
            34°00&apos;S · 18°28&apos;E
          </span>
        </div>

        <div className="loading-hero-skeleton" aria-hidden>
          <div className="loading-hero-image skeleton" />
          <div className="loading-hero-copy">
            <div className="skeleton skeleton-line" style={{ width: '42%', height: 10 }} />
            <div className="skeleton skeleton-line" style={{ width: '82%', height: 28 }} />
            <div className="skeleton skeleton-line" style={{ width: '68%', height: 14 }} />
            <div className="loading-hero-actions">
              <div className="skeleton" style={{ width: 148, height: 44, borderRadius: 999 }} />
              <div className="skeleton skeleton-line" style={{ width: 110, height: 12 }} />
            </div>
          </div>
        </div>

        <div className="loading-cards" aria-hidden>
          <div className="skeleton" style={{ height: 124, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 124, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 124, borderRadius: 12 }} />
        </div>

        <p className="loading-status">
          <span className="loading-spinner" aria-hidden />
          Loading the Cape — field guide, map and experiences
        </p>
      </div>
    </main>
  )
}

export function BootstrapErrorScreen({ onRetry, message }: { onRetry: () => void; message?: string }) {
  const offline = typeof navigator !== 'undefined' && !navigator.onLine
  return (
    <main className="state state-error" role="alert">
      <div className="state-card">
        <div className="state-icon" aria-hidden>{offline ? '◍' : '◇'}</div>
        <h1 className="state-title">{offline ? "You're offline" : 'Capesee could not load'}</h1>
        <p className="state-copy">
          {offline
            ? 'No connection detected. Check your signal — the guide will resume when you are back online.'
            : (message ?? 'Something interrupted the load. Your trip and map data are safe — try again.')}
        </p>
        <div className="state-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>Try again</button>
          <button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>Reload page</button>
        </div>
        {offline ? <p className="state-hint">Tip: open <strong>Discover → Map</strong> once online to cache nearby places.</p> : null}
      </div>
    </main>
  )
}
