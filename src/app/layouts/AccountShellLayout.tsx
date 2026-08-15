import { Link, Outlet, useRouterState } from '@tanstack/react-router'

const TABS = [
  { to: '/account/profile', label: 'Profile' },
  { to: '/account/saved', label: 'Saved' },
  { to: '/account/payments', label: 'Payments' },
  { to: '/account/notifications', label: 'Notifications' },
  { to: '/account/settings', label: 'Settings' },
  { to: '/account/privacy', label: 'Privacy' },
] as const

/** Traveler account shell: shared heading and sub-navigation. */
export function AccountShellLayout() {
  const pathname = useRouterState({ select: (select) => select.location.pathname })

  return (
    <div className="account-shell">
      <header className="account-heading">
        <h1>My account</h1>
        <p>Profile, saved places, payments and preferences for your Capesee trips.</p>
      </header>
      <nav className="account-tabs" aria-label="Account sections">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.to)
          return (
            <Link key={tab.to} to={tab.to} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined}>
              {tab.label}
            </Link>
          )
        })}
      </nav>
      <Outlet />
    </div>
  )
}
