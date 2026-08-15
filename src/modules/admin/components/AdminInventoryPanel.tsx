import { useEffect, useState } from 'react'
import { Button, Card } from '@/components/ui'
import {
  fetchProductSlots,
  updateProductSlot,
  type ProductSlot,
} from '@/modules/bookings/api/products'

const dateFormatter = new Intl.DateTimeFormat('en-ZA', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to update inventory.'
}

export function AdminInventoryPanel({ productId }: { productId: string }) {
  const [slots, setSlots] = useState<ProductSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchProductSlots(productId)
      .then((data) => {
        if (active) setSlots(data)
      })
      .catch((cause: unknown) => {
        if (active) setError(errorMessage(cause))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [productId])

  function patchSlot(id: string, patch: Partial<ProductSlot>) {
    setSlots((current) => current.map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)))
  }

  async function save(slot: ProductSlot) {
    if (slot.capacity < slot.reserved) {
      setError(`Capacity cannot be below the ${slot.reserved} already reserved places.`)
      return
    }

    setBusyId(slot.id)
    setError(undefined)
    try {
      const saved = await updateProductSlot(slot.id, {
        capacity: slot.capacity,
        price_override: slot.price_override,
        status: slot.status,
      })
      patchSlot(slot.id, saved)
    } catch (cause) {
      setError(errorMessage(cause))
    } finally {
      setBusyId(undefined)
    }
  }

  return (
    <Card className="stack">
      <div className="row-between">
        <div>
          <span className="eyebrow">Live Inventory</span>
          <p className="text-faint text-xs">The next 14 departures. Reserved places are protected.</p>
        </div>
        {loading ? <span className="text-faint text-xs">Loading…</span> : null}
      </div>

      {error ? <p className="alert alert-error" role="alert">{error}</p> : null}
      {!loading && slots.length === 0 ? <p className="text-faint">No upcoming slots found.</p> : null}

      {slots.map((slot) => (
        <div className="card stack" key={slot.id}>
          <div className="row-between">
            <strong>{dateFormatter.format(new Date(slot.starts_at))}</strong>
            <span className="text-faint text-xs">{slot.reserved} reserved</span>
          </div>
          <div className="grid-2">
            <label>
              <span className="label">Capacity</span>
              <input
                className="input"
                min={slot.reserved}
                type="number"
                value={slot.capacity}
                onChange={(event) => patchSlot(slot.id, { capacity: event.currentTarget.valueAsNumber || 0 })}
              />
            </label>
            <label>
              <span className="label">Price override (ZAR)</span>
              <input
                className="input"
                min="0"
                type="number"
                value={slot.price_override ?? ''}
                placeholder="Default price"
                onChange={(event) => patchSlot(slot.id, {
                  price_override: event.currentTarget.value === '' ? null : event.currentTarget.valueAsNumber,
                })}
              />
            </label>
          </div>
          <div className="row-between">
            <label>
              <span className="label">Status</span>
              <select
                className="select"
                value={slot.status}
                onChange={(event) => patchSlot(slot.id, { status: event.currentTarget.value })}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <Button type="button" variant="primary" size="sm" disabled={busyId === slot.id} onClick={() => void save(slot)}>
              {busyId === slot.id ? 'Saving…' : 'Save slot'}
            </Button>
          </div>
        </div>
      ))}
    </Card>
  )
}
