import { mockExperiences, mockStays, mockTours, mockTransfers } from '@/lib/mock'
import { useCartStore } from '@/stores/cart'

const CATALOG = [...mockTours, ...mockStays, ...mockTransfers, ...mockExperiences]

export function useCheckoutTotal() {
  const items = useCartStore((state) => state.items)
  return items.reduce((total, item) => {
    const product = CATALOG.find((candidate) => candidate.id === item.productId)
    return total + (product ? product.price * item.qty : 0)
  }, 0)
}
