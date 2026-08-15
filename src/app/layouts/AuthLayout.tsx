import { Outlet, Link } from '@tanstack/react-router'

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link to="/discover" className="brand" style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, display: 'inline-block' }}>
          CAPE<span style={{ color: 'var(--color-accent)' }}>SEE</span>
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
