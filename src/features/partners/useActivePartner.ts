import { usePartnerStore } from './partnerStore'
import { resolvePartner } from './partners'
import type { Partner } from '@/types'

/** The full, validated active-partner object derived from the persisted id. */
export function useActivePartner(): Partner {
  const partnerId = usePartnerStore((s) => s.partnerId)
  return resolvePartner(partnerId)
}
