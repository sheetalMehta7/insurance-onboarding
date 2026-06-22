import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storageKeys } from '@/lib/storage'
import type {
  KycData,
  NomineeData,
  PaymentResult,
  PersonalData,
  Quote,
} from '@/types'

interface JourneyState {
  planId: string | null
  quote: Quote | null
  kyc: KycData | null
  personal: PersonalData | null
  nominee: NomineeData | null
  reviewConfirmed: boolean
  payment: PaymentResult | null

  /** Start a purchase, or resume one already in progress for the same plan. */
  beginPurchase: (planId: string, quote: Quote) => void
  setQuote: (quote: Quote) => void
  setKyc: (data: KycData) => void
  setPersonal: (data: PersonalData) => void
  setNominee: (data: NomineeData) => void
  confirmReview: () => void
  setPayment: (result: PaymentResult) => void
  /** Wipe everything — used on logout and when starting a brand-new purchase. */
  reset: () => void
}

const initial = {
  planId: null,
  quote: null,
  kyc: null,
  personal: null,
  nominee: null,
  reviewConfirmed: false,
  payment: null,
}

/**
 * The in-progress purchase. Persisted so a mid-journey refresh fully restores
 * the user's step and entered data. Editing an earlier step invalidates the
 * later "confirmed" flags so the user can't skip re-review.
 */
export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      ...initial,

      beginPurchase: (planId, quote) => {
        const s = get()
        if (s.planId === planId && !s.payment) {
          // Resume an in-progress purchase; just refresh the chosen quote.
          set({ quote })
        } else {
          // New plan, or the previous purchase already completed → start clean.
          set({ ...initial, planId, quote })
        }
      },
      setQuote: (quote) => set({ quote }),
      setKyc: (kyc) => set({ kyc }),
      setPersonal: (personal) => set({ personal, reviewConfirmed: false }),
      setNominee: (nominee) => set({ nominee, reviewConfirmed: false }),
      confirmReview: () => set({ reviewConfirmed: true }),
      setPayment: (payment) => set({ payment }),
      reset: () => set({ ...initial }),
    }),
    {
      name: storageKeys.journey,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
