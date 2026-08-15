import { Outlet } from '@tanstack/react-router'
import { AdminSidebar } from '@/components/navigation/AdminSidebar'

/** Admin shell — desktop-first sidebar nav (spec §26). */
export function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
