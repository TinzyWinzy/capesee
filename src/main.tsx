import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from './app/providers/AppProviders'
import { initializeAuth } from './services/supabase/auth'
import { hydrateCatalog } from './services/supabase/bootstrap'
import { BootstrapErrorScreen, LoadingScreen } from './components/LoadingScreen'
import { ErrorBoundary } from './components/ErrorBoundary'

const root = createRoot(document.getElementById('root')!)

const BOOTSTRAP_TIMEOUT_MS = 12000

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)),
  ])
}

async function bootstrap() {
  root.render(<LoadingScreen />)

  // Respect save-data / offline: don't block render forever
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    // Render shell immediately; catalog will stay on mock data until online
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <AppProviders />
        </ErrorBoundary>
      </StrictMode>,
    )
    return
  }

  try {
    await withTimeout(Promise.all([initializeAuth(), hydrateCatalog()]), BOOTSTRAP_TIMEOUT_MS, 'Bootstrap')
  } catch (error) {
    console.error('Application bootstrap failed', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const isTimeout = message.includes('timed out')
    root.render(
      <BootstrapErrorScreen
        message={isTimeout ? 'The Cape is taking too long to load — likely a slow connection. Try again, or continue with cached guide.' : message}
        onRetry={() => void bootstrap()}
      />,
    )
    // Auto-retry once when back online
    const onOnline = () => {
      window.removeEventListener('online', onOnline)
      void bootstrap()
    }
    window.addEventListener('online', onOnline, { once: true })
    return
  }

  root.render(
    <StrictMode>
      <ErrorBoundary>
        <AppProviders />
      </ErrorBoundary>
    </StrictMode>,
  )
}

void bootstrap()
