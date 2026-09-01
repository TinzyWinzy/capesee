// @ts-nocheck
import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Card } from '@/components/ui'
import { getPlaces } from '@/modules/places/api/places'
import { fetchProducts } from '@/modules/bookings/api/products'
import { createPastExperience, fetchPastExperience, updatePastExperience } from '@/modules/pastExperiences/api/pastExperiences'
import type { BookableProduct } from '@/types'

export function AdminPastExperienceEditorPage({ experienceId }: { experienceId?: string }) {
  const navigate = useNavigate()
  const isNew = !experienceId || experienceId === 'new'
  const places = getPlaces()
  const [products, setProducts] = useState<BookableProduct[]>([])
  const [title, setTitle] = useState('')
  const [narrative, setNarrative] = useState('')
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0,10))
  const [placeId, setPlaceId] = useState('')
  const [productId, setProductId] = useState('')
  const [coverFile, setCoverFile] = useState<File>()
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{tone:'success'|'error', text:string}|undefined>()

  useEffect(()=>{ fetchProducts().then(setProducts).catch(()=>{}) },[])

  useEffect(()=>{
    if (!isNew && experienceId) {
      fetchPastExperience(experienceId).then(pe=>{
        if (!pe) return
        setTitle(pe.title); setNarrative(pe.narrative); setOccurredAt(pe.occurredAt.slice(0,10))
        setPlaceId(pe.placeId ?? ''); setProductId(pe.productId ?? '')
      }).catch(()=>{})
    }
  },[experienceId, isNew])

  const filteredProducts = placeId ? products.filter(p=>{
    const pl = places.find(pl=>pl.id===placeId)
    return !pl || p.regionSlug===pl.regionSlug
  }) : products

  const save = async (status: 'draft'|'published') => {
    if (!title.trim() || narrative.trim().length < 20) { setMsg({tone:'error', text:'Title required and narrative at least 20 chars.'}); return }
    setBusy(true); setMsg(undefined)
    try {
      if (isNew) {
        const id = await createPastExperience({ title, narrative, occurredAt, placeId: placeId||null, productId: productId||null, status }, coverFile, galleryFiles)
        setMsg({tone:'success', text:'Story created.'})
        navigate({ to: '/admin/past-experiences/$experienceId', params: { experienceId: id } } as any)
      } else {
        await updatePastExperience(experienceId!, { title, narrative, occurredAt, placeId: placeId||null, productId: productId||null, status })
        setMsg({tone:'success', text:'Story updated.'})
      }
    } catch(e){ setMsg({tone:'error', text: e instanceof Error ? e.message : 'Save failed'}) } finally { setBusy(false) }
  }

  return (
    <div className="stack">
      <div className="row">
        <Link to="/admin/past-experiences" className="btn btn-ghost btn-sm">←</Link>
        <h1 className="section-title">{isNew ? 'New Past Experience' : 'Edit Story'}</h1>
      </div>
      {msg ? <p className={msg.tone==='success'?'alert alert-success':'alert alert-error'}>{msg.text}</p> : null}

      <Card className="stack">
        <span className="eyebrow">Story</span>
        <label><span className="label">Title</span><input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Sunset sail — what happened" /></label>
        <label><span className="label">Date occurred</span><input className="input" type="date" value={occurredAt} onChange={e=>setOccurredAt(e.target.value)} /></label>
        <label><span className="label">Narrative</span><textarea className="textarea" rows={6} value={narrative} onChange={e=>setNarrative(e.target.value)} placeholder="Tell the story — what did the group see, who guided, what made it memorable..." /></label>
      </Card>

      <Card className="stack">
        <span className="eyebrow">Link to place & bookable product</span>
        <label><span className="label">Place (optional)</span>
          <select className="select" value={placeId} onChange={e=>setPlaceId(e.target.value)}>
            <option value="">— No place —</option>
            {places.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label><span className="label">Linked product (optional) — shows “Book this experience” on story</span>
          <select className="select" value={productId} onChange={e=>setProductId(e.target.value)}>
            <option value="">— No linked product —</option>
            {filteredProducts.map(p=> <option key={p.id} value={p.id}>{p.type} · {p.title} — R{p.price}</option>)}
          </select>
        </label>
        <p className="text-faint text-xs">Linking is optional. When set, public story links to /book/{'{type}'}s/{'{slug}'}.</p>
      </Card>

      <Card className="stack">
        <span className="eyebrow">Media (cover + gallery)</span>
        <label><span className="label">Cover image</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setCoverFile(e.target.files?.[0] ?? undefined)} /></label>
        <label><span className="label">Gallery (multiple images/videos)</span><input type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={e=>setGalleryFiles(Array.from(e.target.files ?? []))} /></label>
        {galleryFiles.length>0 ? <p className="text-small">{galleryFiles.length} files selected</p> : null}
      </Card>

      <div className="row">
        <Button variant="outline" disabled={busy} onClick={()=>void save('draft')}>{busy?'Saving…':'Save Draft'}</Button>
        <Button variant="primary" disabled={busy} onClick={()=>void save('published')}>{busy?'Publishing…':'Publish'}</Button>
      </div>
    </div>
  )
}
