import { useNavigate } from 'react-router-dom'
import type { OnboardingStepId } from '@/types'
import { STEPS, stepIndex } from '../steps'
import { cn } from '@/lib/cn'

/**
 * Progress indicator for the journey. Completed steps are navigable (go back
 * and edit); future/locked steps are not clickable — the step guard enforces
 * the same rule at the route level.
 */
export function Stepper({
  planId,
  current,
  maxReachable,
}: {
  planId: string
  current: OnboardingStepId
  maxReachable: number
}) {
  const navigate = useNavigate()
  const steps = STEPS.filter((s) => s.inStepper)
  const currentIdx = stepIndex(current)

  return (
    <ol className="flex items-center gap-1 overflow-x-auto pb-1" aria-label="Progress">
      {steps.map((step, i) => {
        const idx = stepIndex(step.id)
        const isDone = idx < currentIdx
        const isActive = idx === currentIdx
        const canGo = idx <= maxReachable && idx < currentIdx

        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1">
            <button
              type="button"
              disabled={!canGo}
              onClick={() => canGo && navigate(`/onboarding/${planId}/${step.id}`)}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-lg px-2 py-1 text-sm transition-colors',
                canGo && 'hover:bg-surface-2',
                !canGo && 'cursor-default',
              )}
            >
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold',
                  isActive && 'bg-brand text-brand-contrast',
                  isDone && 'bg-success text-white',
                  !isActive && !isDone && 'bg-surface-2 text-fg-muted',
                )}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <span
                className={cn(
                  'hidden font-medium sm:inline',
                  isActive ? 'text-fg' : 'text-fg-muted',
                )}
              >
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                className={cn('h-px flex-1', isDone ? 'bg-success' : 'bg-border')}
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
