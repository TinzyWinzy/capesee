import { Link, useRouterState } from '@tanstack/react-router'
import { signOut } from '@/services/supabase/auth'

interface NavGroup {
  label: string
  links: Array<{ to: string; label: string }>
}

const NAV: NavGroup[] = [
  {
    label: 'Operations',
    links: [
      { to: '/admin/bookings', label: 'Bookings' },
      { to: '/admin/tours', label: 'Tours' },
      { to: '/admin/stays', label: 'Stays' },
      { to: '/admin/transfers', label: 'Transfers' },
      { to: '/admin/guides', label: 'Guides' },
    ],
  },
  {
    label: 'Destination',
    links: [
      { to: '/admin/places', label: 'Places' },
      { to: '/admin/discoveries', label: 'Discoveries' },
      { to: '/admin/timeline', label: 'Timeline' },
      { to: '/admin/harvest', label: 'Harvest Queue' },
      { to: '/admin/media', label: 'Media' },
    ],
  },
  {
    label: 'Business',
    links: [
      { to: '/admin/analytics', label: 'Analytics' },
      { to: '/admin/payments', label: 'Payments' },
    ],
  },
  {
    label: 'System',
    links: [
      { to: '/admin/customers', label: 'Travelers' },
      { to: '/admin/settings', label: 'Settings' },
    ],
  },
]

/** Desktop-first admin sidebar. See spec §26. */
export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside className="admin-side">
      <Link to="/admin/dashboard" className="brand">
        CAPESEE ADMIN
      </Link>
      <Link
        to="/admin/dashboard"
        className={`admin-link admin-link-dashboard ${pathname === '/admin/dashboard' ? 'active' : ''}`}
        aria-current={pathname === '/admin/dashboard' ? 'page' : undefined}
      >
        ▦ Dashboard
      </Link>
      {NAV.map((group) => (
        <div key={group.label} className="admin-group">
          <div className="admin-group-label">{group.label}</div>
          {group.links.map((link) => {
            const active = pathname.startsWith(link.to)
            return (
              <Link key={link.to} to={link.to} className={`admin-link ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
                {link.label}
              </Link>
            )
          })}
        </div>
      ))}
      <button className="admin-link admin-link-button" onClick={() => void signOut()}>
        Sign out
      </button>
    </aside>
  )
}
