import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEFAULT_PARTNER_ID, getPartner } from './partners'
import { storageKeys } from '@/lib/storage'

interface PartnerState {
  partnerId: string
  setPartner: (id: string) => void
}

/**
 * Active partner, persisted so the selection survives a reload.
 * Only the id is stored; the full partner object is derived from the registry
 * (single source of truth), so a partner's branding can change without
 * migrating persisted data.
 */
export const usePartnerStore = create<PartnerState>()(
  persist(
    (set) => ({
      partnerId: DEFAULT_PARTNER_ID,
      setPartner: (id) => {
        if (getPartner(id)) set({ partnerId: id })
      },
    }),
    {
      name: storageKeys.partner,
      storage: createJSONStorage(() => localStorage),
      // Guard against a persisted id for a partner that no longer exists.
      merge: (persisted, current) => {
        const p = persisted as Partial<PartnerState> | undefined
        const id = p?.partnerId && getPartner(p.partnerId) ? p.partnerId : current.partnerId
        return { ...current, partnerId: id }
      },
    },
  ),
)
