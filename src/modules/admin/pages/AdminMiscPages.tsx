import { Link } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'
import { Badge, Button, Card, EmptyState, ErrorState, SkeletonCard } from '@/components/ui'
import { formatDate, formatRand } from '@/lib/format'
import { useAsyncData } from '@/lib/useAsyncData'
import { fetchProducts, getProducts } from '@/modules/bookings/api/products'
import { getPlaces } from '@/modules/places/api/places'
import { getMyBookings, fetchMyBookings } from '@/modules/bookings/api/orders'
import { AdminInventoryPanel } from '@/modules/admin/components/AdminInventoryPanel'
import {
  fetchPaymentLedger,
  fetchAuditLog,
  fetchStaffProfiles,
  type PaymentLedgerRow,
} from '@/modules/admin/api/admin'
import { getSupabase } from '@/services/supabase/client'
import { isPaymentSimulationEnabled } from '@/services/payments/paynow'

/** Admin stays list — live with create. */
export function AdminStaysPage() {
  const hasSupabase = Boolean(getSupabase())
  const { data: live, loading } = useAsyncData(() => hasSupabase ? fetchProducts('stay') : Promise.resolve(getProducts('stay')), [])
  const stays = (live ?? getProducts('stay')) as ReturnType<typeof getProducts>
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const createStay = async () => {
    if (!hasSupabase) { setMsg('Supabase not configured'); return }
    setBusy(true)
    try {
      const { createProduct } = await import('@/modules/bookings/api/products')
      const id = await createProduct({ title: `New Stay ${new Date().toLocaleDateString()}`, slug: `new-stay-${Date.now()}`, description: 'Draft stay — edit to publish', price: 1200, product_type: 'stay' })
      window.location.href = `/admin/stays/${id}`
    } catch (e) { setMsg(String((e as Error).message)) } finally { setBusy(false) }
  }
  return (
    <div className="stack">
      <div className="admin-panel-head">
        <h1>Stays</h1>
        <span>{stays.length} properties {loading ? '· loading' : ''}</span>
      </div>
      {msg ? <p className="alert" role="status">{msg}</p> : null}
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <Button variant="primary" size="sm" onClick={createStay} disabled={busy}>{busy ? 'Creating…' : '+ New Stay'}</Button>
      </div>
      <div className="grid-2">
        {stays.map((s) => (
          <Card key={s.id} className="row-between">
            <div>
              <span className="bold text-small">{s.title}</span>
              <p className="text-faint text-xs">{formatRand(s.price)} / night</p>
            </div>
            <Link to="/admin/stays/$stayId" params={{ stayId: s.id }} className="btn btn-outline btn-sm">
              Edit
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** Admin transfers list — live with create. */
export function AdminTransfersPage() {
  const hasSupabase = Boolean(getSupabase())
  const { data: live, loading } = useAsyncData(() => hasSupabase ? fetchProducts('transfer') : Promise.resolve(getProducts('transfer')), [])
  const transfers = (live ?? getProducts('transfer')) as ReturnType<typeof getProducts>
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const createTransfer = async () => {
    if (!hasSupabase) { setMsg('Supabase not configured'); return }
    setBusy(true)
    try {
      const { createProduct } = await import('@/modules/bookings/api/products')
      await createProduct({ title: `New Transfer ${new Date().toLocaleDateString()}`, slug: `new-transfer-${Date.now()}`, description: 'Draft transfer — edit to publish', price: 600, product_type: 'transfer' })
      setMsg('Transfer draft created — refresh to see it')
      window.location.reload()
    } catch (e) { setMsg(String((e as Error).message)) } finally { setBusy(false) }
  }
  return (
    <div className="stack">
      <div className="admin-panel-head">
        <h1>Transfers</h1>
        <span>{transfers.length} services {loading ? '· loading' : ''}</span>
      </div>
      {msg ? <p className="alert" role="status">{msg}</p> : null}
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <Button variant="primary" size="sm" onClick={createTransfer} disabled={busy}>{busy ? 'Creating…' : '+ New Transfer'}</Button>
      </div>
      <div className="grid-2">
        {transfers.map((t) => (
          <Card key={t.id} className="row-between">
            <div>
              <span className="bold text-small">{t.title}</span>
              <p className="text-faint text-xs">{formatRand(t.price)} / {t.priceUnit}</p>
            </div>
            <Badge tone="info">Transfer</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}

/** Admin guides list. Live from profiles with fallback. */
export function AdminGuidesPage() {
  const { data: guides, loading, error } = useAsyncData(() => fetchStaffProfiles(), [])
  const hasSupabase = Boolean(getSupabase())

  return (
    <div className="stack">
      <div className="admin-panel-head">
        <h1>Guides</h1>
        <span>{hasSupabase ? `${guides?.length ?? 0} roster` : 'Roster (mock)'}</span>
      </div>
      {loading ? <SkeletonCard lines={3} /> : null}
      {error ? <p className="alert alert-error" role="alert">{error.message}</p> : null}
      {!loading && !error ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(guides && guides.length > 0 ? guides : [{ id: 'mock-mike', fullName: 'Mike K', phone: null, createdAt: new Date().toISOString() }]).map((g) => (
              <tr key={g.id}>
                <td className="bold text-small">{g.fullName}</td>
                <td className="text-small">{g.phone ?? '—'}</td>
                <td className="text-small">{formatDate(g.createdAt)}</td>
                <td><Badge tone="success">Active</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {!hasSupabase ? <p className="text-faint text-xs" style={{ marginTop: 8 }}>Live roster requires Supabase — showing mock fallback.</p> : null}
    </div>
  )
}

/** Admin travelers list. */
export function AdminCustomersPage() {
  const bookings = getMyBookings()
  const rows = Object.values(
    bookings.reduce<Record<string, { name: string; id: string; count: number }>>((acc, booking) => {
      const row = (acc[booking.travelerId] ??= { name: booking.travelerName, id: booking.travelerId, count: 0 })
      row.count += 1
      return acc
    }, {}),
  )

  return (
    <div className="stack">
      <div className="admin-panel-head">
        <h1>Travelers</h1>
        <span>{rows.length} accounts</span>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon="◇" title="No travelers yet" description="Traveler accounts will appear here once bookings are created." />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Bookings</th>
              <th>First seen</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="bold text-small">{row.name}</td>
                <td>{row.count}</td>
                <td>Aug 2026</td>
                <td className="text-right">
                  <Link to="/admin/customers/$customerId" params={{ customerId: row.id }} className="btn btn-outline btn-sm">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

/** Admin media library — upload to place-media bucket + place_media table. */
export function AdminMediaPage() {
  const places = getPlaces()
  const [placeId, setPlaceId] = useState<string>(places[0]?.id ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [alt, setAlt] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const upload = async () => {
    if (!file || !placeId) { setMsg('Choose a place and file'); return }
    if (!getSupabase()) { setMsg('Supabase not configured — upload is mock'); return }
    setBusy(true); setMsg(null)
    try {
      const supa = getSupabase()!
      const ext = file.name.split('.').pop() ?? 'jpg'
      const key = `places/${placeId}/${Date.now()}-${Math.random().toString(36).slice(2,6)}.${ext}`
      let bucket = 'place-media'
      let { error } = await supa.storage.from(bucket).upload(key, file, { contentType: file.type })
      if (error && error.message.includes('Bucket not found')) {
        // fallback to public bucket if needed
        bucket = 'place-media'
        throw error
      }
      if (error) throw error
      const { data: urlData } = supa.storage.from(bucket).getPublicUrl(key)
      const { error: dbErr } = await supa.from('place_media').insert({ place_id: placeId, kind: 'image', url: urlData.publicUrl, alt_text: alt || null, status: 'published' })
      if (dbErr) throw dbErr
      setMsg(`Uploaded to ${bucket}/${key}`)
      setFile(null); setAlt('')
    } catch (e) { setMsg(String((e as Error).message)) } finally { setBusy(false) }
  }

  return (
    <div className="stack">
      <div className="admin-panel-head">
        <h1>Media</h1>
        <span>Library — upload to Supabase Storage</span>
      </div>
      <Card className="stack">
        <span className="eyebrow">Upload</span>
        {msg ? <p className="alert" role="status">{msg}</p> : null}
        <div className="grid-2">
          <label>
            <span className="label">Place *</span>
            <select className="select" value={placeId} onChange={e => setPlaceId(e.target.value)}>
              {places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label>
            <span className="label">Alt text</span>
            <input className="input" value={alt} onChange={e => setAlt(e.target.value)} placeholder="Hout Bay panorama — field capture" />
          </label>
        </div>
        <label>
          <span className="label">File *</span>
          <input className="input" type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={upload} disabled={busy || !file}>{busy ? 'Uploading…' : 'Upload'}</Button>
        </div>
      </Card>
      <div className="grid-3">
        {places.map((p) => (
          <div key={p.id} className="media ratio-4-3">
            <span className="text-xs">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function paymentTone(status: string): Parameters<typeof Badge>[0]['tone'] {
  const value = status.toLowerCase()
  if (['completed', 'success', 'captured', 'paid'].includes(value)) return 'success'
  if (['failed', 'declined', 'reversed', 'refunded'].includes(value)) return 'danger'
  if (['pending', 'created', 'initiated', 'processing'].includes(value)) return 'info'
  return 'default'
}

/** Admin payments ledger. Wireframe spec §28. */
export function AdminPaymentsPage() {
  const { data: payments, error, loading } = useAsyncData(() => fetchPaymentLedger(), [])
  const captured = (payments ?? []).filter((p) => p.status.toLowerCase() === 'completed')
  const gross = captured.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="stack">
      <div className="admin-panel-head">
        <h1>Payments</h1>
        <span>Payment attempts · {formatRand(gross)} captured</span>
      </div>

      {error ? <ErrorState message={error.message} /> : null}
      {loading ? (
        <div className="stack">
          <SkeletonCard lines={6} />
        </div>
      ) : null}
      {!loading && !error && payments?.length === 0 ? (
        <EmptyState
          icon="R"
          title="No payments recorded"
          description="Payment attempts will appear here once travelers complete checkout."
        />
      ) : null}
      {!loading && !error && payments && payments.length > 0 ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Booking</th>
                <th>Provider</th>
                <th>Reference</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: PaymentLedgerRow) => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.createdAt, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="bold text-small">{payment.bookingCode ?? '—'}</td>
                  <td>{payment.provider}</td>
                  <td className="text-small">{payment.reference ?? '—'}</td>
                  <td className="text-right">{formatRand(payment.amount)}</td>
                  <td>
                    <Badge tone={paymentTone(payment.status)}>{payment.status}</Badge>
                    {payment.failureReason ? <p className="text-faint text-xs">{payment.failureReason}</p> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

/** Admin settings — platform, team and audit trail. Wireframe spec §26. */
export function AdminSettingsPage() {
  const profiles = useAsyncData(() => fetchStaffProfiles(), [])
  const audit = useAsyncData(() => fetchAuditLog(), [])

  return (
    <div className="stack">
      <div className="admin-panel-head">
        <h1>Settings</h1>
        <span>Platform configuration</span>
      </div>

      <Card className="stack">
        <span className="eyebrow">Platform</span>
        <div className="grid-2">
          <div className="row-between">
            <span className="text-small">Supabase</span>
            <Badge tone={getSupabase() ? 'success' : 'default'}>{getSupabase() ? 'Connected' : 'Not configured'}</Badge>
          </div>
          <div className="row-between">
            <span className="text-small">Payment simulation</span>
            <Badge tone={isPaymentSimulationEnabled() ? 'gold' : 'default'}>
              {isPaymentSimulationEnabled() ? 'Enabled' : 'Live provider only'}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="stack">
        <span className="eyebrow">Team members</span>
        {profiles.loading ? <SkeletonCard lines={3} /> : null}
        {profiles.error ? <p className="alert alert-error" role="alert">{profiles.error.message}</p> : null}
        {!profiles.loading && !profiles.error && (profiles.data ?? []).length === 0 ? (
          <p className="text-faint">No profiles yet — they are created when a user signs up.</p>
        ) : null}
        {!profiles.loading && !profiles.error && profiles.data && profiles.data.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles.data.map((profile) => (
                <tr key={profile.id}>
                  <td className="bold text-small">{profile.fullName}</td>
                  <td>{profile.phone ?? '—'}</td>
                  <td>{formatDate(profile.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </Card>

      <Card className="stack">
        <span className="eyebrow">Audit log</span>
        {audit.loading ? <SkeletonCard lines={4} /> : null}
        {audit.error ? <p className="alert alert-error" role="alert">{audit.error.message}</p> : null}
        {!audit.loading && !audit.error && (audit.data ?? []).length === 0 ? (
          <p className="text-faint">No audit events recorded yet.</p>
        ) : null}
        {!audit.loading && !audit.error && audit.data && audit.data.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Actor</th>
              </tr>
            </thead>
            <tbody>
              {audit.data.map((event) => (
                <tr key={event.id}>
                  <td className="text-small">{formatDate(event.createdAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="text-small">{event.action}</td>
                  <td className="text-small">{event.entityType} · {event.entityId.slice(0, 8)}</td>
                  <td className="text-faint text-small">{event.actorId ? `${event.actorId.slice(0, 8)}…` : 'system'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </Card>
    </div>
  )
}

interface StayForm {
  title: string
  description: string
  price: number
  priceUnit: string
  status: string
}

/** Admin stay editor — real catalog values, live save. Wireframe spec §26. */
export function AdminStayEditorPage({ stayId }: { stayId: string }) {
  const live = getSupabase()
  const fallback = getProducts('stay').find((stay) => stay.id === stayId)
  const [form, setForm] = useState<StayForm | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string }>()

  useEffect(() => {
    let active = true
    let cancelled = false
    const apply = (row: { title: string; description: string; price: number; price_unit: string; status: string } | null) => {
      if (cancelled) return
      setForm({
        title: row?.title ?? fallback?.title ?? 'Untitled stay',
        description: row?.description ?? '',
        price: row?.price ?? fallback?.price ?? 0,
        priceUnit: row?.price_unit ?? fallback?.priceUnit ?? 'night',
        status: row?.status ?? 'active',
      })
      setLoaded(true)
    }
    if (live) {
      import('@/modules/bookings/api/products')
        .then(({ fetchProductRow }) => fetchProductRow(stayId))
        .then((row) => { if (active) apply(row) })
        .catch(() => { if (active) apply(null) })
    } else {
      apply(null)
    }
    return () => {
      active = false
      cancelled = true
    }
  }, [stayId, live, fallback?.id, fallback?.title, fallback?.price, fallback?.priceUnit])

  const patch = (partial: Partial<StayForm>) => setForm((current) => (current ? { ...current, ...partial } : current))

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!form) return
    if (!live) {
      setMessage({ tone: 'error', text: 'Live saving needs Supabase configured in this environment.' })
      return
    }
    setBusy(true)
    setMessage(undefined)
    try {
      const { updateProduct } = await import('@/modules/bookings/api/products')
      await updateProduct(stayId, {
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price,
        price_unit: form.priceUnit,
        status: form.status,
      })
      setMessage({ tone: 'success', text: 'Stay updated.' })
    } catch (cause) {
      setMessage({ tone: 'error', text: cause instanceof Error ? cause.message : 'Could not save this stay.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="stack" onSubmit={(event) => void save(event)}>
      <div className="admin-panel-head">
        <div className="row">
          <Link to="/admin/stays" className="btn btn-ghost btn-sm" aria-label="Back to stays">←</Link>
          <h1>Edit stay</h1>
        </div>
        <div className="row">
          <Button type="submit" variant="primary" disabled={!loaded || busy || !form}>
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      {!live ? (
        <p className="alert">Read-only preview — live catalog updates require Supabase configuration.</p>
      ) : null}
      {message ? (
        <p className={message.tone === 'success' ? 'alert alert-success' : 'alert alert-error'} role="status">
          {message.text}
        </p>
      ) : null}

      {!loaded ? <SkeletonCard lines={6} /> : form ? (
        <>
          <Card className="stack">
            <span className="eyebrow">Basic information</span>
            <label>
              <span className="label">Title</span>
              <input className="input" value={form.title} onChange={(event) => patch({ title: event.currentTarget.value })} />
            </label>
            <label>
              <span className="label">Description</span>
              <textarea className="textarea" rows={4} value={form.description} onChange={(event) => patch({ description: event.currentTarget.value })} />
            </label>
          </Card>

          <Card className="stack">
            <span className="eyebrow">Pricing</span>
            <div className="admin-form-grid">
              <label>
                <span className="label">Price (ZAR)</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => patch({ price: event.currentTarget.valueAsNumber || 0 })}
                />
              </label>
              <label>
                <span className="label">Billing unit</span>
                <select className="select" value={form.priceUnit} onChange={(event) => patch({ priceUnit: event.currentTarget.value })}>
                  <option value="night">Per night</option>
                  <option value="person">Per person</option>
                  <option value="trip">Per trip</option>
                </select>
              </label>
              <label>
                <span className="label">Status</span>
                <select className="select" value={form.status} onChange={(event) => patch({ status: event.currentTarget.value })}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>
          </Card>

          <AdminInventoryPanel productId={stayId} />
        </>
      ) : null}
    </form>
  )
}

/** Admin customer detail — profile and bookings. */
export function AdminCustomerDetailPage({ customerId }: { customerId: string }) {
  const { data: bookings, error, loading } = useAsyncData(() => fetchMyBookings(), [])

  if (loading) {
    return (
      <div className="stack">
        <SkeletonCard lines={5} />
      </div>
    )
  }
  if (error) return <ErrorState message={error.message} />

  const customersBookings = (bookings ?? []).filter((booking) => booking.travelerId === customerId)
  const first = customersBookings[0]
  const totalSpend = customersBookings.reduce((sum, booking) => sum + booking.total, 0)

  return (
    <div className="stack">
      <div className="row">
        <Link to="/admin/customers" className="btn btn-ghost btn-sm" aria-label="Back to travelers">←</Link>
        <h1 className="section-title">{first?.travelerName ?? 'Traveler'}</h1>
      </div>

      {customersBookings.length === 0 ? (
        <EmptyState icon="◇" title="No bookings yet" description="This traveler has not completed a booking." />
      ) : (
        <>
          <div className="grid-2">
            <Card>
              <div className="eyebrow">Bookings</div>
              <div className="bold" style={{ fontSize: 24 }}>{customersBookings.length}</div>
            </Card>
            <Card>
              <div className="eyebrow">Total spend</div>
              <div className="bold" style={{ fontSize: 24 }}>{formatRand(totalSpend)}</div>
            </Card>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Dates</th>
                <th className="text-right">Total</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {customersBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="bold text-small">{booking.code}</td>
                  <td className="text-small">{formatDate(booking.dates.start)} – {formatDate(booking.dates.end)}</td>
                  <td className="text-right">{formatRand(booking.total)}</td>
                  <td>
                    <Badge tone={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'info'}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <Link to="/admin/bookings/$bookingId" params={{ bookingId: booking.id }} className="btn btn-outline btn-sm">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
