import type { BookableProduct, BookableType } from '@/types'
import type { Tables, TablesUpdate } from '@/types/database.generated'
import { getProductBySlug, mockExperiences, mockStays, mockTours, mockTransfers } from '@/lib/mock'
import { getSupabase } from '@/services/supabase/client'

/** Product catalog queries (T09–T11). TODO(Sprint 2): supabase.from('products'). */
export function getProducts(type: BookableType): BookableProduct[] {
  switch (type) {
    case 'tour':
      return mockTours
    case 'stay':
      return mockStays
    case 'transfer':
      return mockTransfers
    case 'experience':
      return mockExperiences
  }
}

export function getProduct(type: BookableType, slug: string): BookableProduct | undefined {
  return getProductBySlug(type, slug)
}

type ProductCatalogRow = Tables<'products'> & {
  regions: Pick<Tables<'regions'>, 'slug'>
}

export type ProductSlot = Tables<'product_slots'>

export async function fetchProductSlots(productId: string, limit = 14): Promise<ProductSlot[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('product_slots')
    .select('*')
    .eq('product_id', productId)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at')
    .limit(limit)

  if (error) throw error
  return data
}

export async function updateProductSlot(
  id: string,
  update: Pick<TablesUpdate<'product_slots'>, 'capacity' | 'price_override' | 'status'>,
): Promise<ProductSlot> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is required to manage live inventory.')

  const { data, error } = await supabase.from('product_slots').update(update).eq('id', id).select().single()
  if (error) throw error
  return data
}

function mapProduct(row: ProductCatalogRow): BookableProduct {
  return {
    id: row.id,
    type: row.product_type as BookableType,
    slug: row.slug,
    title: row.title,
    price: row.price,
    priceUnit: row.price_unit as BookableProduct['priceUnit'],
    rating: row.rating,
    reviewCount: row.review_count,
    durationHours: row.duration_hours ?? undefined,
    regionSlug: row.regions.slug,
    coverUrl: row.cover_url ?? undefined,
    pickupIncluded: row.pickup_included,
    guideIncluded: row.guide_included,
    groupSize: (row as unknown as { group_size?: number | null }).group_size ?? undefined,
  }
}

export async function fetchProducts(type?: BookableType): Promise<BookableProduct[]> {
  const supabase = getSupabase()
  if (!supabase) {
    return type
      ? getProducts(type)
      : [...mockTours, ...mockStays, ...mockTransfers, ...mockExperiences]
  }

  let query = supabase.from('products').select('*, regions!inner(slug)').order('title')
  if (type) query = query.eq('product_type', type)

  const { data, error } = await query
  if (error) throw error
  return (data as ProductCatalogRow[]).map(mapProduct)
}

export async function fetchProduct(type: BookableType, slug: string): Promise<BookableProduct | undefined> {
  const products = await fetchProducts(type)
  return products.find((product) => product.slug === slug)
}

export async function fetchProductRow(id: string): Promise<Tables<'products'> | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function updateProduct(
  id: string,
  update: Pick<TablesUpdate<'products'>, 'title' | 'description' | 'price' | 'price_unit' | 'status'> & { cover_url?: string | null; group_size?: number | null },
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is required to manage live catalog items.')

  const { error } = await supabase.from('products').update(update as never).eq('id', id)
  if (error) throw error
}

export async function createProduct(input: { title: string; slug: string; description: string; price: number; product_type: BookableType; regionSlug?: string; price_unit?: string; duration_hours?: number | null; group_size?: number | null }): Promise<string> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase required to create products')
  const regionSlug = input.regionSlug ?? 'western-cape'
  const { data: region, error: rErr } = await supabase.from('regions').select('id').eq('slug', regionSlug).maybeSingle()
  if (rErr) throw rErr
  if (!region) throw new Error(`Region "${regionSlug}" not found`)
  const { data: userData } = await supabase.auth.getUser()
  const providerId = userData.user?.id ?? null
  const { data, error } = await supabase.from('products').insert({
    title: input.title,
    slug: input.slug,
    description: input.description || input.title,
    price: input.price,
    product_type: input.product_type,
    region_id: region.id,
    price_unit: input.price_unit ?? (input.product_type === 'stay' ? 'night' : input.product_type === 'transfer' ? 'trip' : 'person'),
    duration_hours: input.duration_hours ?? null,
    group_size: input.group_size ?? null,
    provider_id: providerId,
    status: 'draft',
  } as never).select('id').single()
  if (error) throw error
  return (data as { id: string }).id
}

export async function uploadProductCover(file: File): Promise<string> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase required for upload')
  const ext = file.name.split('.').pop() ?? 'jpg'
  const key = `products/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`
  // try product-images bucket, fallback to place-media
  let bucket = 'product-images'
  let { error } = await supabase.storage.from(bucket).upload(key, file, { contentType: file.type })
  if (error && error.message.includes('Bucket not found')) {
    bucket = 'place-media'
    const retry = await supabase.storage.from(bucket).upload(key, file, { contentType: file.type })
    if (retry.error) throw retry.error
  } else if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(key)
  return data.publicUrl
}
