import { create } from 'zustand'

export interface TravelerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  pickupLocation: string
  requirements: string
}

export type CheckoutPaymentMethod = 'paynow' | 'card'

interface CheckoutState {
  traveler: TravelerDetails
  paymentMethod: CheckoutPaymentMethod
  paymentReference?: string
  bookingId?: string
  bookingCode?: string
  paymentError?: string
  simulated: boolean
  setTraveler: (traveler: TravelerDetails) => void
  setPaymentMethod: (method: CheckoutPaymentMethod) => void
  setPaymentResult: (result: { reference?: string; error?: string; simulated?: boolean; bookingId?: string; bookingCode?: string }) => void
  reset: () => void
}

const EMPTY_TRAVELER: TravelerDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  pickupLocation: '',
  requirements: '',
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  traveler: EMPTY_TRAVELER,
  paymentMethod: 'paynow',
  simulated: false,
  setTraveler: (traveler) => set({ traveler }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setPaymentResult: ({ reference, error, simulated = false, bookingId, bookingCode }) => set({ paymentReference: reference, paymentError: error, simulated, bookingId, bookingCode }),
  reset: () => set({ traveler: EMPTY_TRAVELER, paymentMethod: 'paynow', paymentReference: undefined, paymentError: undefined, bookingId: undefined, bookingCode: undefined, simulated: false }),
}))
