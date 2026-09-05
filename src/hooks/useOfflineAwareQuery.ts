import { useEffect, useState } from 'react'
import { loadCachedCatalog, syncCatalog } from '@/services/offlineSync'

export function useOfflineAwareCatalog() {
  const [loading, setLoading] = useState(true)
  const [fromCache, setFromCache] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const res = await syncCatalog()
      if (cancelled) return
      setFromCache(Boolean((res as { fromCache?: boolean }).fromCache))
      const cached = await loadCachedCatalog()
      if (!cancelled) {
        setLastSync(cached.lastSync)
        setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  return { loading, fromCache, lastSync }
}
