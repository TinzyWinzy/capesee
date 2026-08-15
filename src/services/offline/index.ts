import type { Pin } from '@/types'

/**
 * Offline layer stub. Sprint 6 wires IndexedDB (via a lib like idb) and a
 * service worker. The API is fixed now so screens can queue offline actions
 * today. See spec §44.
 */
export interface QueuedAction {
  id: string
  kind: 'publish-pin' | 'save-place' | 'review'
  payload: Pin
  queuedAt: string
}

const queueKey = 'capesee.offline.queue'

export function isOnline(): boolean {
  return navigator.onLine
}

export function readQueue(): QueuedAction[] {
  try {
    return JSON.parse(localStorage.getItem(queueKey) ?? '[]') as QueuedAction[]
  } catch {
    return []
  }
}

export function enqueueAction(action: Omit<QueuedAction, 'queuedAt'>): void {
  const queue = readQueue()
  queue.push({ ...action, queuedAt: new Date().toISOString() })
  localStorage.setItem(queueKey, JSON.stringify(queue))
}

export function flushQueue(): QueuedAction[] {
  const queue = readQueue()
  localStorage.setItem(queueKey, '[]')
  return queue
}
