import type { OnboardingStepId } from '@/types'

export interface StepMeta {
  id: OnboardingStepId
  label: string
  /** Shown in the stepper; result is terminal and not counted as a form step. */
  inStepper: boolean
}

export const STEPS: StepMeta[] = [
  { id: 'kyc', label: 'KYC', inStepper: true },
  { id: 'personal', label: 'Personal', inStepper: true },
  { id: 'nominee', label: 'Nominee', inStepper: true },
  { id: 'review', label: 'Review', inStepper: true },
  { id: 'payment', label: 'Payment', inStepper: true },
  { id: 'result', label: 'Done', inStepper: false },
]

export const STEP_ORDER: OnboardingStepId[] = STEPS.map((s) => s.id)

export function stepIndex(step: OnboardingStepId): number {
  return STEP_ORDER.indexOf(step)
}

/** Snapshot of journey completion used by the step guard. */
export interface JourneyProgress {
  kyc: boolean
  personal: boolean
  nominee: boolean
  reviewConfirmed: boolean
  payment: boolean
}

/**
 * Highest step index the user is allowed to view, given what they've completed.
 * Steps unlock strictly in order; this is what blocks jumping ahead.
 */
export function maxReachableIndex(p: JourneyProgress): number {
  let idx = 0 // kyc is always reachable once a journey exists
  if (p.kyc) idx = 1
  if (p.kyc && p.personal) idx = 2
  if (p.kyc && p.personal && p.nominee) idx = 3
  if (p.kyc && p.personal && p.nominee && p.reviewConfirmed) idx = 4
  if (p.kyc && p.personal && p.nominee && p.reviewConfirmed && p.payment) idx = 5
  return idx
}

/** Where to send a user who tries to open a step they haven't unlocked. */
export function resolveAllowedStep(
  requested: OnboardingStepId,
  p: JourneyProgress,
): OnboardingStepId {
  const max = maxReachableIndex(p)
  const reqIdx = stepIndex(requested)
  return reqIdx > max ? STEP_ORDER[max] : requested
}
