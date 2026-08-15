import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.generated'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

if (import.meta.env.PROD && (!url || !publishableKey)) {
  throw new Error('Missing required Supabase production configuration.')
}

let client: SupabaseClient<Database> | null = null

/**
 * Lazily create the Supabase client. Returns null until VITE_SUPABASE_URL /
 * VITE_SUPABASE_PUBLISHABLE_KEY are configured — the scaffold runs against mock data.
 * RLS remains authoritative; frontend guards are UX only (spec §39).
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (client) return client
  if (!url || !publishableKey) return null
  client = createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
  return client
}
