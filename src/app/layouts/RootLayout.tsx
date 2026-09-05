import { Outlet } from '@tanstack/react-router'
import { NetworkStatus } from '@/components/NetworkStatus'

export function RootLayout() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded">
        Skip to content
      </a>
      <NetworkStatus />
      <div id="main">
        <Outlet />
      </div>
    </>
  )
}
