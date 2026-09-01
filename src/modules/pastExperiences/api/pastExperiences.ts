import type { PastExperience } from '@/types'
import { getSupabase } from '@/services/supabase/client'
import { mockPastExperiences } from '@/lib/mockPastExperiences'

type Row = {
  id: string
  provider_id: string | null
  place_id: string | null
  product_id: string | null
  title: string
  narrative: string
  occurred_at: string
  cover_url: string | null
  status: string
  created_at: string
  places?: { slug: string; name: string } | null
  products?: { slug: string; product_type: string } | null
  past_experience_media?: Array<{ id: string; experience_id: string; kind: string; url: string; alt_text: string | null; sort_order: number }>
}

function mapRow(r: Row): PastExperience {
  return {
    id: r.id,
    providerId: r.provider_id ?? undefined,
    placeId: r.place_id ?? undefined,
    productId: r.product_id ?? undefined,
    productSlug: r.products?.slug,
    productType: r.products?.product_type as PastExperience['productType'],
    placeSlug: r.places?.slug,
    placeName: r.places?.name,
    title: r.title,
    narrative: r.narrative,
    occurredAt: r.occurred_at,
    coverUrl: r.cover_url ?? undefined,
    status: r.status as PastExperience['status'],
    createdAt: r.created_at,
    media: (r.past_experience_media ?? []).map(m => ({
      id: m.id,
      experienceId: m.experience_id,
      kind: m.kind as PastExperience['media'][number]['kind'],
      url: m.url,
      altText: m.alt_text ?? undefined,
      sortOrder: m.sort_order,
    })).sort((a,b)=>a.sortOrder-b.sortOrder),
  }
}

export async function fetchPastExperiences(publishedOnly = true): Promise<PastExperience[]> {
  const supabase = getSupabase()
  if (!supabase) return publishedOnly ? mockPastExperiences.filter(p=>p.status==='published') : mockPastExperiences

  let q = supabase.from('past_experiences')
    .select('*, places!past_experiences_place_id_fkey(slug,name), products!past_experiences_product_id_fkey(slug,product_type), past_experience_media(*)')
    .order('occurred_at', { ascending: false })
  if (publishedOnly) q = q.eq('status','published')
  const { data, error } = await q
  if (error) {
    // Table missing before migration: PostgREST cache PGRST205 or Postgres 42P01 undefined_table
    const code = (error as any).code
    const msg = (error as any).message ?? ''
    if (code === 'PGRST205' || code === '42P01' || msg.includes('past_experiences') || msg.includes('past_experience_media')) {
      return publishedOnly ? mockPastExperiences.filter(p=>p.status==='published') : mockPastExperiences
    }
    throw error
  }
  // create signed URLs for private bucket
  const allUrls = (data as Row[]).flatMap(r => [r.cover_url, ...(r.past_experience_media ?? []).map(m=>m.url)].filter(Boolean) as string[])
  let signedMap = new Map<string,string>()
  if (allUrls.length) {
    const { data: signed } = await supabase.storage.from('past-experience-media').createSignedUrls(allUrls, 3600)
    signed?.forEach(s => { if (s.signedUrl) signedMap.set(s.path ?? '', s.signedUrl) })
  }
  return (data as Row[]).map(r => {
    const m = mapRow(r)
    if (m.coverUrl) m.coverUrl = signedMap.get(m.coverUrl) ?? m.coverUrl
    m.media = m.media.map(mm => ({ ...mm, url: signedMap.get(mm.url) ?? mm.url }))
    return m
  })
}

export async function fetchPastExperience(id: string): Promise<PastExperience | undefined> {
  const supabase = getSupabase()
  if (!supabase) return mockPastExperiences.find(p=>p.id===id)
  const { data, error } = await supabase.from('past_experiences')
    .select('*, places!past_experiences_place_id_fkey(slug,name), products!past_experiences_product_id_fkey(slug,product_type), past_experience_media(*)')
    .eq('id', id).maybeSingle()
  if (error) {
    const code = (error as any).code
    const msg = (error as any).message ?? ''
    if (code === 'PGRST205' || code === '42P01' || msg.includes('past_experiences')) return mockPastExperiences.find(p=>p.id===id)
    throw error
  }
  if (!data) return undefined
  const row = data as Row
  const urls = [row.cover_url, ...(row.past_experience_media ?? []).map(m=>m.url)].filter(Boolean) as string[]
  let signedMap = new Map<string,string>()
  if (urls.length) {
    const { data: signed } = await supabase.storage.from('past-experience-media').createSignedUrls(urls, 3600)
    signed?.forEach(s=>{ if(s.signedUrl) signedMap.set(s.path??'', s.signedUrl)})
  }
  const mapped = mapRow(row)
  if (mapped.coverUrl) mapped.coverUrl = signedMap.get(mapped.coverUrl) ?? mapped.coverUrl
  mapped.media = mapped.media.map(mm=>({ ...mm, url: signedMap.get(mm.url) ?? mm.url }))
  return mapped
}

export async function createPastExperience(input: {
  title: string, narrative: string, occurredAt: string, placeId?: string | null, productId?: string | null, status?: string
}, coverFile?: File, galleryFiles?: File[]): Promise<string> {
  const supabase = getSupabase()
  if (!supabase) {
    const id = `pe-${Date.now()}`
    mockPastExperiences.unshift({
      id, title: input.title, narrative: input.narrative, occurredAt: input.occurredAt,
      placeId: input.placeId ?? undefined, productId: input.productId ?? undefined,
      status: (input.status as PastExperience['status']) ?? 'draft', createdAt: new Date().toISOString(), media: []
    })
    return id
  }
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) throw new Error('Sign in required')

  let coverPath: string | undefined
  if (coverFile) {
    const ext = coverFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    coverPath = `${auth.user.id}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('past-experience-media').upload(coverPath, coverFile, { cacheControl:'3600', upsert:false, contentType: coverFile.type })
    if (error) throw new Error(`Cover upload failed: ${error.message}`)
  }

  const { data, error } = await supabase.from('past_experiences').insert({
    provider_id: auth.user.id,
    place_id: input.placeId ?? null,
    product_id: input.productId ?? null,
    title: input.title.trim(),
    narrative: input.narrative.trim(),
    occurred_at: input.occurredAt,
    cover_url: coverPath ?? null,
    status: input.status ?? 'draft',
  }).select('id').single()
  if (error) {
    const code = (error as any).code
    const msg = (error as any).message ?? ''
    if (code === 'PGRST205' || code === '42P01' || msg.includes('past_experiences')) {
      // remote table missing — mock fallback
      const mockId = `pe-${Date.now()}`
      mockPastExperiences.unshift({
        id: mockId, title: input.title, narrative: input.narrative, occurredAt: input.occurredAt,
        placeId: input.placeId ?? undefined, productId: input.productId ?? undefined,
        status: (input.status as PastExperience['status']) ?? 'draft', createdAt: new Date().toISOString(), media: []
      })
      if (coverPath) await supabase.storage.from('past-experience-media').remove([coverPath]).catch(()=>{})
      return mockId
    }
    if (coverPath) await supabase.storage.from('past-experience-media').remove([coverPath])
    throw new Error(error.message)
  }
  const expId = data.id as string

  if (galleryFiles?.length) {
    for (let i=0;i<galleryFiles.length;i++) {
      const f = galleryFiles[i]
      const ext = f.name.split('.').pop()?.toLowerCase() || 'jpg'
      const kind = f.type.startsWith('video') ? 'video' : 'image'
      const path = `${auth.user.id}/${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage.from('past-experience-media').upload(path, f, { cacheControl:'3600', upsert:false, contentType: f.type })
      if (upErr) continue
      await supabase.from('past_experience_media').insert({ experience_id: expId, kind, url: path, sort_order: i })
    }
  }
  return expId
}

export async function updatePastExperience(id: string, patch: { title?: string, narrative?: string, occurredAt?: string, placeId?: string | null, productId?: string | null, status?: string }): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) {
    const idx = mockPastExperiences.findIndex(p=>p.id===id)
    if (idx>=0) Object.assign(mockPastExperiences[idx], { title: patch.title ?? mockPastExperiences[idx].title, narrative: patch.narrative ?? mockPastExperiences[idx].narrative })
    return
  }
  const { error } = await supabase.from('past_experiences').update({
    title: patch.title,
    narrative: patch.narrative,
    occurred_at: patch.occurredAt,
    place_id: patch.placeId,
    product_id: patch.productId,
    status: patch.status,
  }).eq('id', id)
  if (error) {
    const code = (error as any).code
    const msg = (error as any).message ?? ''
    if (code === 'PGRST205' || code === '42P01' || msg.includes('past_experiences')) {
      const idx = mockPastExperiences.findIndex(p=>p.id===id)
      if (idx>=0) Object.assign(mockPastExperiences[idx], { title: patch.title ?? mockPastExperiences[idx].title, status: patch.status ?? mockPastExperiences[idx].status })
      return
    }
    throw error
  }
}
