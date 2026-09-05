import { Link } from '@tanstack/react-router'
import type { Booking } from '@/types'
import { Badge, Button, Card } from '@/components/ui'
import { formatRand } from '@/lib/format'
import { useState } from 'react'
import { updateBookingGuide, updateBookingStatus, fetchStaffProfiles } from '@/modules/admin/api/admin'
import { useAsyncData } from '@/lib/useAsyncData'
import { getSupabase } from '@/services/supabase/client'

/** A02 detail — booking record with guide assignment + status. */
export function AdminBookingDetailPage({ booking }: { booking: Booking }) {
  const hasSupabase = Boolean(getSupabase())
  const { data: guides } = useAsyncData(() => hasSupabase ? fetchStaffProfiles() : Promise.resolve([]), [])
  const [guideId, setGuideId] = useState(booking.guideId ?? '')
  const [status, setStatus] = useState(booking.status)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const saveGuide = async () => {
    if (!hasSupabase) { setMsg('Supabase not configured — guide assignment is mock'); return }
    setBusy(true)
    try { await updateBookingGuide(booking.id, guideId || null); setMsg('Guide assigned'); } catch (e) { setMsg(String((e as Error).message)) } finally { setBusy(false) }
  }
  const saveStatus = async (next: string) => {
    if (!hasSupabase) { setMsg('Supabase not configured'); return }
    setBusy(true)
    try { await updateBookingStatus(booking.id, next); setStatus(next); setMsg(`Status → ${next}`) } catch (e) { setMsg(String((e as Error).message)) } finally { setBusy(false) }
  }

  return (
    <div className="stack">
      <div className="row-between">
        <div className="row">
          <Link to="/admin/bookings" className="btn btn-ghost btn-sm" aria-label="Back">
            ←
          </Link>
          <h1 className="section-title">{booking.code}</h1>
        </div>
        <Badge tone={status === 'confirmed' ? 'success' : 'default'}>{status}</Badge>
      </div>
      {msg ? <p className="alert" role="status">{msg}</p> : null}

      <div className="grid-2">
        <Card className="stack">
          <span className="eyebrow">Customer</span>
          <span className="bold text-small">{booking.travelerName}</span>
        </Card>
        <Card className="stack">
          <span className="eyebrow">Items</span>
          {booking.items.map((i) => (
            <span key={i.productId} className="text-small">
              {i.type} × {i.qty}
            </span>
          ))}
        </Card>
        <Card className="stack">
          <span className="eyebrow">Payments</span>
          <span className="text-small bold">{formatRand(booking.total)}</span>
        </Card>
        <Card className="stack">
          <span className="eyebrow">Guide</span>
          {!hasSupabase ? <span className="text-faint text-small">Not assigned (mock)</span> : (
            <div className="row" style={{ gap: 8 }}>
              <select className="select" value={guideId} onChange={e => setGuideId(e.target.value)} style={{ flex: 1 }}>
                <option value="">Unassigned</option>
                {(guides ?? []).map(g => <option key={g.id} value={g.id}>{g.fullName}</option>)}
              </select>
              <Button variant="outline" size="sm" onClick={saveGuide} disabled={busy}>Save</Button>
            </div>
          )}
        </Card>
      </div>
      <Card className="stack">
        <span className="eyebrow">Status</span>
        <div className="row wrap">
          {['pending','confirmed','completed','cancelled'].map(s => (
            <button key={s} className={status===s?'chip chip-active':'chip'} onClick={() => saveStatus(s)} disabled={busy}>{s}</button>
          ))}
        </div>
      </Card>

      <Card className="stack">
        <span className="eyebrow">Timeline</span>
        {['Created', 'Paid', 'Confirmed'].map((e, i) => (
          <span key={e} className="text-small">
            {i + 1}. {e}
          </span>
        ))}
      </Card>

      <Card className="stack">
        <span className="eyebrow">Audit history</span>
        <span className="text-faint text-xs">Changes logged here once admin mutations land.</span>
      </Card>
    </div>
  )
}
