import { Link } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Card, EmptyState, SkeletonCard } from '@/components/ui'
import { useAsyncData } from '@/lib/useAsyncData'
import { formatRand } from '@/lib/format'
import { fetchAdminStats } from '@/modules/admin/api/admin'
import { useAuthStore } from '@/stores/auth'
import { getSupabase } from '@/services/supabase/client'
import { getPlaces } from '@/modules/places/api/places'

async function hapticSuccess() {
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
    await Haptics.impact({ style: ImpactStyle.Light })
    // @ts-ignore
    if (Haptics.notification) await Haptics.notification({ type: 'SUCCESS' } as never)
  } catch {}
}

/** Premium IG/FB feed — Lazarus on-the-go: paste WhatsApp text, snap photo, post in 15s */
export function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: stats, error, loading } = useAsyncData(() => fetchAdminStats(), [])
  const places = getPlaces()
  const fileRef = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Bookings' | 'Media'>('All')
  const [quickText, setQuickText] = useState('')
  const [quickPlace, setQuickPlace] = useState<string>(places[0]?.id ?? '')
  const [quickCat, setQuickCat] = useState<'Wildlife' | 'History' | 'Food' | 'Other'>('Wildlife')
  const [quickFile, setQuickFile] = useState<File | null>(null)
  const [posting, setPosting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // feed: merge pending discoveries + recent bookings + recent media into IG cards
  const { data: feed } = useAsyncData(async () => {
    const supa = getSupabase()
    if (!supa) return [] as Array<{ id: string; kind: 'discovery' | 'booking' | 'media'; title: string; subtitle: string; time: string; status: string; image?: string }>
    const [pins, bookings] = await Promise.all([
      supa.from('discoveries').select('id, title, category, place_id, photo_url, status, created_at').order('created_at', { ascending: false }).limit(8),
      supa.from('bookings').select('id, code, status, traveler_details, created_at').order('created_at', { ascending: false }).limit(5),
    ])
    const rows: Array<{ id: string; kind: 'discovery' | 'booking' | 'media'; title: string; subtitle: string; time: string; status: string; image?: string }> = []
    for (const p of (pins.data ?? [])) rows.push({ id: p.id, kind: 'discovery', title: p.title, subtitle: `${p.category} • ${places.find(x => x.id === p.place_id)?.name ?? 'Cape'}`, time: p.created_at, status: p.status, image: p.photo_url ?? undefined })
    for (const b of (bookings.data ?? [])) {
      const name = (b.traveler_details as Record<string, string>)?.fullName ?? 'Traveler'
      rows.push({ id: b.id, kind: 'booking', title: b.code, subtitle: `${name} • ${b.status}`, time: b.created_at, status: b.status })
    }
    return rows.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)
  }, [])

  const quickPost = async () => {
    const text = quickText.trim()
    if (!text) { setToast('Add a note — e.g. “Lion at Kirstenbosch, 2m from path”'); return }
    if (!getSupabase()) { setToast('Supabase not configured — post is mock'); return }
    setPosting(true)
    try {
      const supa = getSupabase()!
      // parse lat/lng from WhatsApp paste like " -33.98, 18.43 "
      const m = text.match(/(-?\d{1,2}\.\d+)\s*[,;]\s*(-?\d{1,3}\.\d+)/)
      const lat = m ? Number(m[1]) : -33.987
      const lng = m ? Number(m[2]) : 18.432
      let photoUrl: string | null = null
      if (quickFile) {
        const ext = quickFile.name.split('.').pop() ?? 'jpg'
        const key = `places/${quickPlace || places[0]?.id}/feed-${Date.now()}.${ext}`
        const bucket = 'place-media'
        const { error: upErr } = await supa.storage.from(bucket).upload(key, quickFile, { contentType: quickFile.type })
        if (upErr) throw upErr
        const { data } = supa.storage.from(bucket).getPublicUrl(key)
        photoUrl = data.publicUrl
      }
      const { data: auth } = await supa.auth.getUser()
      const { error } = await supa.from('discoveries').insert({
        title: text.slice(0, 80),
        description: text,
        category: quickCat,
        latitude: lat,
        longitude: lng,
        place_id: quickPlace || null,
        photo_url: photoUrl,
        status: 'pending',
        author_id: auth.user?.id ?? (await supa.auth.getUser()).data.user?.id,
      } as never)
      if (error) throw error
      setQuickText(''); setQuickFile(null); if (fileRef.current) fileRef.current.value = ''
      setToast('Posted to pending — approve in feed')
      await hapticSuccess()
      window.setTimeout(() => window.location.reload(), 600)
    } catch (e) { setToast(String((e as Error).message)) } finally { setPosting(false) }
  }

  const filteredFeed = (feed ?? []).filter(r => filter === 'All' || (filter === 'Pending' && r.status === 'pending') || (filter === 'Bookings' && r.kind === 'booking') || (filter === 'Media' && r.kind === 'discovery' && !!r.image))

  return (
    <div className="admin-feed-shell">
      {/* Top bar — premium, editorial */}
      <div className="admin-feed-top">
        <div>
          <p className="eyebrow">Field feed • 34°00′S · 18°28′E</p>
          <h1 className="admin-feed-title">Good morning, {user?.fullName?.split(' ')[0] ?? 'Lazarus'}.</h1>
          <p className="text-faint text-small">What’s happening in the Cape? Post it and it’s live.</p>
        </div>
        <div className="admin-feed-kpis">
          {loading ? <SkeletonCard lines={1} /> : stats ? (
            <>
              <span className="admin-kpi"><strong>{stats.pendingDiscoveries}</strong> pending</span>
              <span className="admin-kpi"><strong>{stats.unassignedBookings}</strong> bookings</span>
              <span className="admin-kpi"><strong>{stats.pins}</strong> pins</span>
              <span className="admin-kpi hide-mobile"><strong>{formatRand(stats.revenue)}</strong> revenue</span>
            </>
          ) : null}
        </div>
      </div>

      {error ? <p className="alert alert-error" role="alert">{error.message}</p> : null}
      {toast ? <p className="alert alert-success" role="status" onClick={() => setToast(null)}>{toast} — tap to dismiss</p> : null}

      {/* Quick composer — FB/IG status box */}
      <Card className="admin-composer">
        <div className="admin-composer-row">
          <div className="admin-avatar">{(user?.fullName?.[0] ?? 'L').toUpperCase()}</div>
          <input
            className="admin-composer-input"
            placeholder="What’s happening? Paste WhatsApp text with location e.g. “Lion at -33.98, 18.43”"
            value={quickText}
            onChange={e => setQuickText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), quickPost())}
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={quickPost} disabled={posting || !quickText.trim()}>{posting ? 'Posting…' : 'Post'}</button>
        </div>
        <div className="admin-composer-meta">
          <select className="select select-sm" value={quickPlace} onChange={e => setQuickPlace(e.target.value)} aria-label="Place">
            {places.slice(0, 12).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="select select-sm" value={quickCat} onChange={e => setQuickCat(e.target.value as never)} aria-label="Category">
            <option>Wildlife</option><option>History</option><option>Food</option><option>Other</option>
          </select>
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={e => setQuickFile(e.target.files?.[0] ?? null)} className="admin-file-input" />
          <div className="admin-composer-actions">
            <button type="button" className="admin-icon-btn" onClick={() => fileRef.current?.click()} aria-label="Add photo">📷</button>
            <Link to="/admin/media" className="admin-icon-btn" aria-label="Media library">🖼️</Link>
            <Link to="/admin/places/new" className="admin-icon-btn" aria-label="New place">📍</Link>
          </div>
        </div>
        {quickFile ? <p className="text-faint text-xs">📎 {quickFile.name} — will upload to place-media on Post</p> : null}
      </Card>

      {/* Filter chips — IG stories style */}
      <div className="admin-feed-filters" role="tablist" aria-label="Feed filter">
        {(['All','Pending','Bookings','Media'] as const).map(f => (
          <button key={f} role="tab" aria-selected={filter===f} className={`admin-filter-chip ${filter===f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
            {f} {f==='Pending' && stats ? `· ${stats.pendingDiscoveries}` : ''}
          </button>
        ))}
        <Link to="/admin/discoveries" className="admin-filter-link">Review queue →</Link>
      </div>

      {/* Feed — premium cards, staggered, IG scroll */}
      {!feed ? <SkeletonCard lines={4} /> : filteredFeed.length === 0 ? (
        <EmptyState icon="▦" title="Feed clear" description="No pending items — post an update above or check back after guests report." />
      ) : (
        <div className="admin-feed-grid">
          {filteredFeed.map(item => (
            <Card key={`${item.kind}-${item.id}`} className="admin-feed-card">
              <div className="admin-feed-card-head">
                <span className={`admin-feed-kind kind-${item.kind}`}>{item.kind}</span>
                <span className={`badge ${item.status==='pending'?'badge-gold':item.status==='confirmed'||item.status==='approved'?'badge-success':''}`}>{item.status}</span>
                <span className="text-faint text-xs">{new Date(item.time).toLocaleDateString()} • {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {item.image ? <div className="media ratio-16-9" style={{ marginTop: 10 }}><img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /></div> : null}
              <strong className="admin-feed-card-title">{item.title}</strong>
              <p className="text-faint text-xs">{item.subtitle}</p>
              <div className="admin-feed-card-actions">
                {item.kind==='discovery' && item.status==='pending' ? (
                  <>
                    <Link to="/admin/discoveries" className="btn btn-primary btn-sm">Approve</Link>
                    <Link to="/admin/discoveries" className="btn btn-ghost btn-sm">Reject</Link>
                  </>
                ) : item.kind==='booking' ? (
                  <Link to={"/admin/bookings/$bookingId" as never} params={{ bookingId: item.id } as never} className="btn btn-outline btn-sm">Open booking</Link>
                ) : (
                  <Link to="/admin/media" className="btn btn-ghost btn-sm">View media</Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="admin-feed-foot">
        <span className="eyebrow">On-the-go tip</span>
        <p className="text-small">Lazarus: receive WhatsApp “Eland at -33.92, 18.42, near Tokara” → paste above → Post → pending → Approve → live on map in 30s. No form.</p>
      </Card>
    </div>
  )
}
