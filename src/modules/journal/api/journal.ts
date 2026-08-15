import type { Pin } from '@/types'
import { getPinById, mockPins } from '@/lib/mock'
import { getSupabase } from '@/services/supabase/client'

/** Journal queries (T07–T08, T17–T18). TODO(Sprint 3): user-scoped + offline queue. */
export function getMyPins(): Pin[] {
  return mockPins
}

export function getPin(pinId: string): Pin | undefined {
  return getPinById(pinId)
}

export async function publishPin(pin: Omit<Pin, 'id' | 'status' | 'createdAt'>, mediaFile?: File): Promise<Pin> {
  const supabase = getSupabase()
  if (supabase) {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) throw new Error('Sign in to publish a discovery.')
    let mediaPath: string | undefined
    if (mediaFile) {
      const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
      if (!allowedTypes.has(mediaFile.type)) throw new Error('Use a JPEG, PNG or WebP image.')
      if (mediaFile.size > 10 * 1024 * 1024) throw new Error('Images must be smaller than 10 MB.')
      const extension = mediaFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      mediaPath = `${authData.user.id}/${crypto.randomUUID()}.${extension}`
      const { error: uploadError } = await supabase.storage.from('discovery-media').upload(mediaPath, mediaFile, {
        cacheControl: '3600',
        contentType: mediaFile.type,
        upsert: false,
      })
      if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`)
    }

    const { data, error } = await supabase.from('discoveries').insert({
      author_id: authData.user.id,
      place_id: pin.placeId || null,
      title: pin.title.trim(),
      description: pin.description?.trim() || null,
      category: pin.category,
      latitude: pin.coordinates.lat,
      longitude: pin.coordinates.lng,
      photo_url: mediaPath ?? null,
      status: 'pending',
    }).select().single()
    if (error) {
      if (mediaPath) await supabase.storage.from('discovery-media').remove([mediaPath])
      throw new Error(error.message)
    }
    const signedPhoto = mediaPath
      ? (await supabase.storage.from('discovery-media').createSignedUrl(mediaPath, 3600)).data?.signedUrl
      : undefined
    const created: Pin = {
      ...pin,
      id: data.id,
      status: data.status as Pin['status'],
      createdAt: data.created_at,
      photoUrl: signedPhoto,
      likes: data.likes_count,
      comments: data.comments_count,
    }
    mockPins.unshift(created)
    return created
  }
  const created: Pin = { ...pin, id: `pin-${Date.now()}`, status: 'draft', createdAt: new Date().toISOString() }
  mockPins.unshift(created)
  return created
}
