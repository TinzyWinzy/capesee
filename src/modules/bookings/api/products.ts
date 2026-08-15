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
  update: Pick<TablesUpdate<'products'>, 'title' | 'description' | 'price' | 'price_unit' | 'status'>,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is required to manage live catalog items.')

  const { error } = await supabase.from('products').update(update).eq('id', id)
  if (error) throw error
}
