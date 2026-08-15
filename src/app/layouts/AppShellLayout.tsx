import { Outlet } from '@tanstack/react-router'
import { BottomNavigation } from '@/components/navigation/BottomNavigation'
import { DesktopNavigation } from '@/components/navigation/DesktopNavigation'

/** Traveler shell: top nav on desktop, bottom nav on mobile (spec §1). */
export function AppShellLayout() {
  return (
    <div className="app-shell">
      <DesktopNavigation />
      <Outlet />
      <BottomNavigation />
    </div>
  )
}
