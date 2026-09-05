import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Capesee] Unhandled render error', error, info.componentStack)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      const offline = typeof navigator !== 'undefined' && !navigator.onLine
      return (
        <main className="state state-error" role="alert" aria-live="assertive">
          <div className="state-card">
            <div className="state-icon" aria-hidden>◇</div>
            <h1 className="state-title">Something went wrong</h1>
            <p className="state-copy">
              {offline
                ? 'You appear to be offline. Reconnect and try again — your data is safe.'
                : 'The page hit an unexpected error. Try again, or reload to restore the guide.'}
            </p>
            {this.state.error ? (
              <details className="state-details">
                <summary>Error details</summary>
                <code>{this.state.error.message}</code>
              </details>
            ) : null}
            <div className="state-actions">
              <button type="button" className="btn btn-primary" onClick={this.handleReset}>Try again</button>
              <button type="button" className="btn btn-ghost" onClick={this.handleReload}>Reload page</button>
            </div>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
