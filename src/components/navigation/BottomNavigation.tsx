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

  const isActive = (to: string) => {
    if (to === '/discover') return pathname === '/' || pathname.startsWith('/discover')
    if (to === '/account/profile') return pathname.startsWith('/account')
    return pathname.startsWith(to)
  }

  return (
    <nav className="nav-bottom" aria-label="Primary">
      {ITEMS.map((item) => {
        const active = isActive(item.to)
        return (
          <Link key={item.to} to={item.to} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
            <span className="nav-icon"><Icon name={item.icon} /></span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
