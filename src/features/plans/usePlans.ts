import { useQuery } from '@tanstack/react-query'
import { fetchPlan, fetchPlans } from './plans.api'
import { usePartnerStore } from '@/features/partners/partnerStore'

/**
 * Fetches plans for the selected partner with filters.
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
