import { Link, useRouterState } from '@tanstack/react-router'
import { cx } from '@/lib/utils'

const TABS = [
  { to: '/guide/dashboard', label: 'Today' },
  { to: '/guide/schedule', label: 'Schedule' },
  { to: '/guide/check-in', label: 'Check-in' },
  { to: '/guide/profile', label: 'Profile' },
] as const

/** Guide navigation — intentionally simpler. See spec §21. */
export function GuideTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav className="nav-top">
      <div className="nav-top-inner" style={{ gap: 6 }}>
        {TABS.map((tab) => (
          <Link key={tab.to} to={tab.to} className={cx('chip', pathname.startsWith(tab.to) && 'chip-active')}>
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
