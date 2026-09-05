import { db, putAll, setMeta, getMeta } from './offlineDb'
import { getSupabase } from './supabase/client'
import { fetchPlaces, fetchTimeline } from '@/modules/places/api/places'
import { fetchProducts } from '@/modules/bookings/api/products'
import { fetchDiscoveries } from '@/modules/discover/api/discoveries'

const META_LAST_SYNC = 'lastSyncAt'

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, rej) => setTimeout(() => rej(new Error('Sync timeout')), ms)),
  ])
}

/** Pull fresh data from Supabase and cache to Dexie. Falls back to cache on error. */
export async function syncCatalog() {
  const supabase = getSupabase()
  if (!supabase) return { fromCache: true as const }

  try {
    const [places, products, discoveries, timeline] = await withTimeout(
      Promise.all([fetchPlaces(), fetchProducts(), fetchDiscoveries(), fetchTimeline()]),
      7000,
    )
    await db.transaction('rw', db.places, db.products, db.discoveries, db.timeline, async () => {
      await putAll(db.places, places as never)
      await putAll(db.products, products as never)
      await putAll(db.discoveries, discoveries as never)
      await putAll(db.timeline, timeline as never)
    })
    await setMeta(META_LAST_SYNC, new Date().toISOString())
    return { fromCache: false as const, counts: { places: places.length, products: products.length, discoveries: discoveries.length, timeline: timeline.length } }
  } catch (e) {
    console.warn('[Capesee] syncCatalog failed — serving cache', e)
    return { fromCache: true as const, error: String(e) }
  }
}

export async function loadCachedCatalog() {
  const [places, products, discoveries, timeline] = await Promise.all([
    db.places.toArray(),
    db.products.toArray(),
    db.discoveries.toArray(),
    db.timeline.toArray(),
  ])
  const lastSync = await getMeta(META_LAST_SYNC)
  return { places, products, discoveries, timeline, lastSync }
}

export async function queueSubmission(endpoint: string, payload: unknown) {
  await db.pending.add({ endpoint, payload, createdAt: new Date().toISOString(), retries: 0 })
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const reg = await navigator.serviceWorker.ready
      // @ts-expect-error SyncManager not in lib
      await reg.sync.register('capesee-sync')
    } catch {
      // SW not ready — will flush on next online
    }
  }
}

export async function flushPending(): Promise<number> {
  const pending = await db.pending.toArray()
  if (pending.length === 0) return 0
  let flushed = 0
  for (const item of pending) {
    try {
      const res = await fetch(item.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await db.pending.delete(item.id!)
      flushed++
    } catch (e) {
      await db.pending.update(item.id!, { retries: item.retries + 1 })
      console.warn('[Capesee] flush pending failed', item.id, e)
    }
  }
  return flushed
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    queueMicrotask(async () => {
      const n = await flushPending()
      if (n > 0) console.info(`[Capesee] Flushed ${n} pending submission(s) on reconnect`)
      await syncCatalog()
    })
  })
}
