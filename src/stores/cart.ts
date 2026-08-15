import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clear: () => void
  count: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set({
        items: get().items.some((existing) => existing.productId === item.productId)
          ? get().items.map((existing) => existing.productId === item.productId ? item : existing)
          : [...get().items, item],
      }),
      remove: (productId) => set({ items: get().items.filter((item) => item.productId !== productId) }),
      updateQty: (productId, qty) => set({
        items: get().items.map((item) => item.productId === productId ? { ...item, qty: Math.max(1, qty) } : item),
      }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((total, item) => total + item.qty, 0),
    }),
    { name: 'capesee-cart-v1', version: 1 },
  ),
)
