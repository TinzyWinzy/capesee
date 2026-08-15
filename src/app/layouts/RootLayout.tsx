import { Outlet } from '@tanstack/react-router'
import { useOnline } from '@/hooks/useOnline'

export function RootLayout() {
  const online = useOnline()

  return (
    <>
      {!online ? <div className="offline-banner">You're offline</div> : null}
      <Outlet />
    </>
  )
}
