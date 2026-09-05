import { Outlet } from '@tanstack/react-router'
import { AdminSidebar } from '@/components/navigation/AdminSidebar'
import { Seo } from '@/components/Seo'

/** Admin shell — desktop-first sidebar nav (spec §26). */
export function AdminLayout() {
  return (
    <div className="admin-shell">
      <Seo title="Admin" noindex={true} />
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
