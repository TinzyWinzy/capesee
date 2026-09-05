import type { User as SupabaseUser } from '@supabase/supabase-js'
import { getSupabase } from './client'
import { hydrateUserBookings } from './bootstrap'
import { useAuthStore } from '@/stores/auth'
import type { Role, User } from '@/types'

const roles: Role[] = ['traveler', 'guide', 'driver', 'admin']

const ADMIN_EMAILS = new Set(['brandontinoz@gmail.com'])

function toAppUser(user: SupabaseUser | null): User | null {
  if (!user) return null

  const claimedRole = user.app_metadata.role
  // hard fallback for owner email so dashboard appears even before SQL migration
  const fallbackAdmin = Boolean(user.email && ADMIN_EMAILS.has(user.email.toLowerCase()))
  const role = fallbackAdmin ? 'admin' : roles.includes(claimedRole as Role) ? (claimedRole as Role) : 'traveler'
  const fullName =
    typeof user.user_metadata.full_name === 'string' && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name
      : user.email ?? 'Traveler'

  return {
    id: user.id,
    email: user.email,
    fullName,
    role,
    phone: user.phone || undefined,
    avatarUrl: typeof user.user_metadata.avatar_url === 'string' ? user.user_metadata.avatar_url : undefined,
  }
}

async function hydrateProfile(user: SupabaseUser): Promise<User> {
  const fallback = toAppUser(user)!
  const supabase = getSupabase()
  if (!supabase) return fallback

  const { data } = await supabase
    .from('profiles')
    .select('full_name, phone, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (!data) return fallback
  return {
    ...fallback,
    fullName: data.full_name,
    phone: data.phone ?? fallback.phone,
    avatarUrl: data.avatar_url ?? fallback.avatarUrl,
  }
}

/**
 * Hydrate the route-guard store from Supabase before the router renders, then
 * keep it synchronized with sign-in, token refresh, and sign-out events.
 */
export async function initializeAuth() {
  const store = useAuthStore.getState()
  const supabase = getSupabase()

  if (!supabase) {
    store.setHydrated(true)
    return
  }

  store.setHydrated(false)
  const { data } = await supabase.auth.getUser()
  useAuthStore.getState().setUser(data.user ? await hydrateProfile(data.user) : null)
  useAuthStore.getState().setHydrated(true)
  if (data.user) {
    await hydrateUserBookings()
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setUser(toAppUser(session?.user ?? null))
    useAuthStore.getState().setHydrated(true)
    if (session?.user) {
      window.setTimeout(() => {
        void hydrateProfile(session.user).then((user) => useAuthStore.getState().setUser(user))
      }, 0)
    }
  })
}

/**
 * Auth wiring stub. When Supabase env vars are present this delegates to
 * Supabase auth; otherwise it falls back to the dev store so guards remain
 * testable. See docs/supabase-api-contract.md §auth.
 */
export async function signInWithEmail(email: string, password: string) {
  if (import.meta.env.DEV && email === 'traveler@example.com' && password === 'prototype-only') {
    useAuthStore.getState().devSignIn('traveler')
    return { ok: true as const }
  }

  const supabase = getSupabase()
  if (!supabase) {
    useAuthStore.getState().devSignIn('traveler')
    return { ok: true }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false as const, error: error.message }
  useAuthStore.getState().setUser(data.user ? await hydrateProfile(data.user) : null)
  await hydrateUserBookings()
  return { ok: true as const }
}

export async function signUpWithEmail(fullName: string, email: string, password: string) {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, error: 'Account creation requires Supabase configuration.' }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) return { ok: false as const, error: error.message }
  if (data.user && data.session) useAuthStore.getState().setUser(await hydrateProfile(data.user))
  return { ok: true as const, needsVerification: !data.session }
}

export async function signInWithProvider(provider: 'google' | 'apple') {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, error: 'Social sign-in requires Supabase configuration.' }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  return error ? { ok: false as const, error: error.message } : { ok: true as const }
}

export async function sendPasswordReset(email: string) {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, error: 'Password reset requires Supabase configuration.' }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/account/settings`,
  })
  return error ? { ok: false as const, error: error.message } : { ok: true as const }
}

export async function completeAuthCallback() {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, error: 'Supabase is not configured.' }

  const { data, error } = await supabase.auth.getSession()
  if (error) return { ok: false as const, error: error.message }
  if (data.session?.user) useAuthStore.getState().setUser(await hydrateProfile(data.session.user))
  return data.session ? { ok: true as const } : { ok: false as const, error: 'No active sign-in session was found.' }
}

export async function updateProfile(input: { fullName: string; phone: string }) {
  const supabase = getSupabase()
  if (!supabase) return { ok: false as const, error: 'Profile updates require Supabase configuration.' }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) return { ok: false as const, error: authError?.message ?? 'You are not signed in.' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: input.fullName.trim(), phone: input.phone.trim() || null })
    .eq('id', authData.user.id)

  if (error) return { ok: false as const, error: error.message }
  await supabase.auth.updateUser({ data: { full_name: input.fullName.trim() } })
  useAuthStore.getState().setUser({
    ...toAppUser(authData.user)!,
    fullName: input.fullName.trim(),
    phone: input.phone.trim() || undefined,
  })
  return { ok: true as const }
}

export async function signOut() {
  const supabase = getSupabase()
  if (supabase) await supabase.auth.signOut()
  useAuthStore.getState().signOut()
  const { mockBookings } = await import('@/lib/mock')
  mockBookings.splice(0, mockBookings.length)
}
