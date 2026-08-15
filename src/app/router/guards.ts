import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/types'

/**
 * Frontend route guards (spec §39). UX only — Supabase RLS is authoritative.
 * Requires the auth store to be hydrated; real auth replaces the dev store.
 */

export function requireAuth({ location }: { location: { href: string } }) {
  const { user } = useAuthStore.getState()
  if (!user) throw redirect({ to: '/auth/login', search: { redirect: location.href } })
}

export function requireRole(...roles: Role[]) {
  const { user } = useAuthStore.getState()
  if (!user) throw redirect({ to: '/auth/login', search: { redirect: undefined } })
  if (!roles.includes(user.role)) throw redirect({ to: '/discover' })
}

export function requireGuide() {
  requireRole('guide', 'driver')
}

export function requireAdmin() {
  requireRole('admin')
}
