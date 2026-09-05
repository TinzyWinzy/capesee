import { Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { AdminSidebar } from '@/components/navigation/AdminSidebar'
import { Seo } from '@/components/Seo'

/** Admin shell — mobile drawer for on-the-go Lazarus updates. */
export function AdminLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="admin-shell">
      <Seo title="Admin" noindex={true} />
      <header className="admin-mobile-bar">
        <button type="button" className="admin-menu-btn" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close admin menu' : 'Open admin menu'} aria-expanded={open}>
          {open ? '✕' : '☰'} <span>CAPESEE ADMIN</span>
        </button>
        <span className="admin-mobile-hint">On-the-go • Laz</span>
      </header>
      <div className={`admin-side-wrap ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
        <div onClick={(e) => e.stopPropagation()}>
          <AdminSidebar />
        </div>
      </div>
      <main className="admin-main" id="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
