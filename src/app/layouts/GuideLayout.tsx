import { Outlet } from '@tanstack/react-router'
import { GuideTabs } from '@/components/navigation/GuideTabs'

/** Guide shell — simple: Today, Schedule, Check-in, Profile (spec §21). */
export function GuideLayout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <GuideTabs />
      <Outlet />
    </div>
  )
}
