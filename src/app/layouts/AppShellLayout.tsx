import { Outlet } from '@tanstack/react-router'
import { BottomNavigation } from '@/components/navigation/BottomNavigation'
import { DesktopNavigation } from '@/components/navigation/DesktopNavigation'

/** Traveler shell: top nav on desktop, bottom nav on mobile (spec §1). */
export function AppShellLayout() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 'calc(var(--nav-bottom-h) + var(--safe-bottom) + 8px)' }}>
      <DesktopNavigation />
      <Outlet />
      <BottomNavigation />
    </div>
  )
}
