import type { Plan } from '@/types'
import { plans } from './plans.data'

/**
 * Mock data access layer.
 *
 * Simulates a network: artificial latency plus an opt-in failure switch so the
 * UI's loading and error states are real and demoable (toggle via
 * `localStorage.setItem('ins.simulateError','1')`). Returning promises here
 * means swapping in a real backend later only touches this file.
 */
const LATENCY_MS = 500

function shouldFail(): boolean {
  try {
    return localStorage.getItem('ins.simulateError') === '1'
  } catch {
    return false
  }
}

function delay<T>(value: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      if (shouldFail()) reject(new Error('Failed to load plans. Please retry.'))
      else resolve(value)
    }, LATENCY_MS)

    signal?.addEventListener('abort', () => {
      clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

export interface PlanQuery {
  partnerId: string
  search?: string
  category?: string
}

/** Plans offered by a partner, optionally filtered by search text/category. */
export async function fetchPlans(
  { partnerId, search, category }: PlanQuery,
  signal?: AbortSignal,
): Promise<Plan[]> {
  let result = plans.filter((p) => p.partnerIds.includes(partnerId))

  if (category && category !== 'All') {
    result = result.filter((p) => p.category === category)
  }
  if (search?.trim()) {
    const q = search.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }
  return delay(result, signal)
}

/** A single plan, scoped to the active partner (404-style if not offered). */
export async function fetchPlan(
  id: string,
  partnerId: string,
  signal?: AbortSignal,
): Promise<Plan | null> {
  const plan = plans.find((p) => p.id === id) ?? null
  if (plan && !plan.partnerIds.includes(partnerId)) {
    // Plan exists but isn't offered by this partner.
    return delay(null, signal)
  }
  return delay(plan, signal)
}
