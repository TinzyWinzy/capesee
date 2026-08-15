import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, User } from '@/types'

interface AuthState {
  user: User | null
  hydrated: boolean
  setUser: (user: User | null) => void
  setHydrated: (hydrated: boolean) => void
  signOut: () => void
  /** Dev helper: sign in as a role without a backend. Remove when real auth lands. */
  devSignIn: (role: Role) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setUser: (user) => set({ user }),
      setHydrated: (hydrated) => set({ hydrated }),
      signOut: () => set({ user: null }),
      devSignIn: (role) => set({
        user: {
          id: `dev-${role}`,
          fullName: role === 'admin' ? 'Linda Moyo' : role === 'guide' ? 'Mike K' : 'Tinotenda',
          role,
        },
      }),
    }),
    {
      name: 'capesee-auth-v1',
      version: 1,
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
