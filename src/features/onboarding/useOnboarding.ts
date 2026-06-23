import { useOutletContext } from 'react-router-dom'
import type { Plan, Quote } from '@/types'

export interface OnboardingContext {
  plan: Plan
  quote: Quote
}

/** Typed access to the active plan + quote for the current journey step. */
export function useOnboarding() {
  return useOutletContext<OnboardingContext>()
}
