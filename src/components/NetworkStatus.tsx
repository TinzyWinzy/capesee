import { useOnline } from '@/hooks/useOnline'
import { useEffect, useState } from 'react'
import { db } from '@/services/offlineDb'

export function NetworkStatus() {
  const online = useOnline()
  const [pending, setPending] = useState(0)

  useEffect(() => {
    let id: number | undefined
    const refresh = async () => setPending(await db.pending.count())
    refresh()
    id = window.setInterval(refresh, 4000)
    window.addEventListener('capesee:offline-queue' as never, refresh)
    window.addEventListener('online', refresh)
    return () => {
      if (id) clearInterval(id)
      window.removeEventListener('capesee:offline-queue' as never, refresh)
      window.removeEventListener('online', refresh)
    }
  }, [])

  if (online && pending === 0) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`network-status ${online ? 'network-status-online' : 'network-status-offline'}`}
    >
      <span aria-hidden>{online ? '●' : '◍'}</span>
      {online
        ? pending > 0
          ? `Back online — syncing ${pending} pending submission${pending > 1 ? 's' : ''}…`
          : 'Back online'
        : pending > 0
          ? `You're offline — ${pending} submission${pending > 1 ? 's' : ''} queued, showing cached content`
          : "You're offline — showing cached content"}
    </div>
  )
}
