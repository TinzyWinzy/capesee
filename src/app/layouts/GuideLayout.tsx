import { Outlet } from '@tanstack/react-router'
import { GuideTabs } from '@/components/navigation/GuideTabs'
import { Seo } from '@/components/Seo'

/** Guide shell — simple: Today, Schedule, Check-in, Profile (spec §21). */
export function GuideLayout() {
  return (
    <div className="guide-shell">
      <Seo title="Guide" noindex={true} />
      <GuideTabs />
      <Outlet />
    </div>
  )
}
