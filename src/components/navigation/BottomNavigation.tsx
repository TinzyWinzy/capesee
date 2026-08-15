import { Link, useRouterState } from '@tanstack/react-router'
import { Icon } from '@/components/ui'

const ITEMS = [
  { to: '/discover', label: 'Discover', icon: 'compass' },
  { to: '/book', label: 'Book', icon: 'ticket' },
  { to: '/trips', label: 'Trips', icon: 'plane' },
  { to: '/journal', label: 'Journal', icon: 'journal' },
  { to: '/account/profile', label: 'Me', icon: 'user' },
] as const

export function BottomNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const isActive = (to: string) => (to === '/discover' ? pathname === '/' || pathname.startsWith('/discover') : pathname.startsWith(to))

  return (
    <nav className="nav-bottom" aria-label="Primary">
      {ITEMS.map((item) => (
        <Link key={item.to} to={item.to} className={isActive(item.to) ? 'active' : ''}>
          <span className="nav-icon"><Icon name={item.icon} /></span>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
