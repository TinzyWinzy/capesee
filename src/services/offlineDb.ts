import Dexie, { type Table } from 'dexie'
import type { Place, TimelineEvent, BookableProduct, Pin } from '@/types'

export interface PendingSubmission {
  id?: number
  endpoint: string
  payload: unknown
  createdAt: string
  retries: number
}

export interface OfflineMeta {
  key: string
  value: string
}

class CapeseeDB extends Dexie {
  places!: Table<Place, string>
  timeline!: Table<TimelineEvent, string>
  products!: Table<BookableProduct, string>
  discoveries!: Table<Pin, string>
  pending!: Table<PendingSubmission, number>
  meta!: Table<OfflineMeta, string>

  constructor() {
    super('CapeseeDB')
    this.version(1).stores({
      places: 'id, slug, regionSlug, name',
      timeline: 'id, placeId, year',
      products: 'id, slug, type, regionSlug',
      discoveries: 'id, placeId, category, status',
      pending: '++id, endpoint, createdAt',
      meta: 'key',
    })
  }
}

export const db = new CapeseeDB()

export async function putAll<T extends { id: string }>(table: Table<T, string>, items: T[]) {
  if (items.length === 0) return
  await table.bulkPut(items)
}

export async function getAllCached<T>(table: Table<T, string>): Promise<T[]> {
  return table.toArray()
}

export async function setMeta(key: string, value: string) {
  await db.meta.put({ key, value })
}

export async function getMeta(key: string): Promise<string | null> {
  const row = await db.meta.get(key)
  return row?.value ?? null
}
