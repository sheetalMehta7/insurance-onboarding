import { useQuery } from '@tanstack/react-query'
import { fetchPlan, fetchPlans } from './plans.api'
import { usePartnerStore } from '@/features/partners/partnerStore'

/**
 * Plans for the active partner, with optional search/category filters.
 *
 * React Query passes an AbortSignal to the query fn and cancels the previous
 * request when the key changes — so a slow earlier response can't overwrite a
 * newer one (the in-flight-cancellation stretch goal, for free).
 */
export function usePlans(search?: string, category?: string) {
  const partnerId = usePartnerStore((s) => s.partnerId)
  return useQuery({
    queryKey: ['plans', partnerId, search ?? '', category ?? 'All'],
    queryFn: ({ signal }) => fetchPlans({ partnerId, search, category }, signal),
  })
}

export function usePlan(id: string | undefined) {
  const partnerId = usePartnerStore((s) => s.partnerId)
  return useQuery({
    queryKey: ['plan', partnerId, id],
    queryFn: ({ signal }) => fetchPlan(id!, partnerId, signal),
    enabled: Boolean(id),
  })
}
