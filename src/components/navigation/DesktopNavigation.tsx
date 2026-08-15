import { Link, useRouterState } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth'
import { Icon } from '@/components/ui'

const LINKS = [
  { to: '/discover', label: 'Discover' },
  { to: '/book', label: 'Book' },
  { to: '/trips', label: 'Trips' },
  { to: '/journal', label: 'Journal' },
] as const

/** Top navigation for desktop. See spec §1. */
export function DesktopNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const user = useAuthStore((s) => s.user)
  const isActive = (to: string) =>
    to === '/discover'
      ? pathname === '/' || pathname.startsWith('/discover')
      : pathname.startsWith(to)

  return (
    <header className="nav-top">
      <div className="nav-top-inner">
        <Link to="/discover" className="brand">
          CAPE<span>SEE</span>
        </Link>
        <nav className="nav-links desktop-only">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={isActive(link.to) ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="spacer" />
        <Link to="/discover/search" search={{ q: '' }} className="nav-icon-button" aria-label="Search Capesee">
          <Icon name="search" />
        </Link>
        <Link to={user ? '/account/profile' : '/auth/login'} className="avatar" aria-label="Profile">
          {user?.fullName?.charAt(0) ?? '?'}
        </Link>
      </div>
    </header>
  )
}
