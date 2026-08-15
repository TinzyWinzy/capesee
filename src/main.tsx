import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from './app/providers/AppProviders'
import { initializeAuth } from './services/supabase/auth'
import { hydrateCatalog } from './services/supabase/bootstrap'

const root = createRoot(document.getElementById('root')!)

async function bootstrap() {
  root.render(<main className="state" aria-live="polite"><div className="state-title">Loading Capesee…</div></main>)

  try {
    await Promise.all([initializeAuth(), hydrateCatalog()])
  } catch (error) {
    root.render(
      <main className="state">
        <div className="state-title">Capesee could not load</div>
        <p>Please check your connection and try again.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>
      </main>,
    )
    console.error('Application bootstrap failed', error)
    return
  }

  root.render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  )
}

void bootstrap()
