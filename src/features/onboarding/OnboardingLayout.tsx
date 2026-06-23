import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import type { OnboardingStepId } from '@/types'
import type { OnboardingContext } from './useOnboarding'
import { usePlan } from '@/features/plans/usePlans'
import { defaultQuote } from '@/features/plans/quote'
import { useJourneyStore } from './journeyStore'
import { STEP_ORDER, maxReachableIndex, resolveAllowedStep } from './steps'
import { Stepper } from './components/Stepper'
import { OrderSummary } from './components/OrderSummary'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/states'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { Link } from 'react-router-dom'

export default function OnboardingLayout() {
  const { planId = '' } = useParams()
  const location = useLocation()
  const plan = usePlan(planId)

  const journey = useJourneyStore()
  const { beginPurchase, setQuote } = journey

  // Initialise the journey for this plan. If the user deep-linked straight here
  // (no prior config), seed a default quote; if they came from Buy Now, the
  // store already holds their chosen quote — don't clobber it.
  useEffect(() => {
    if (!plan.data) return
    if (journey.planId !== plan.data.id) {
      beginPurchase(plan.data.id, defaultQuote(plan.data))
    } else if (!journey.quote) {
      setQuote(defaultQuote(plan.data))
    }
  }, [plan.data, journey.planId, journey.quote, beginPurchase, setQuote])

  // Current step from the URL (/onboarding/:planId/:step).
  const segment = location.pathname.split('/')[3] as OnboardingStepId | undefined
  const currentStep: OnboardingStepId =
    segment && STEP_ORDER.includes(segment) ? segment : 'kyc'

  if (plan.isLoading) return <OnboardingSkeleton />

  if (plan.isError || !plan.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon="🔍"
          title="Plan not available"
          message="This plan isn’t offered by the current partner. Browse the full catalog instead."
        />
        <div className="mt-6 text-center">
          <Link to="/" className={buttonStyles({ variant: 'outline' })}>
            Back to plans
          </Link>
        </div>
      </div>
    )
  }

  // Wait until the store reflects this plan before evaluating the guard,
  // otherwise stale progress from a previous plan could misroute.
  if (journey.planId !== plan.data.id || !journey.quote) {
    return <OnboardingSkeleton />
  }

  // Step guard: block jumping ahead to a locked step.
  const progress = {
    kyc: Boolean(journey.kyc),
    personal: Boolean(journey.personal),
    nominee: Boolean(journey.nominee),
    reviewConfirmed: journey.reviewConfirmed,
    payment: Boolean(journey.payment),
  }
  const allowed = resolveAllowedStep(currentStep, progress)
  if (allowed !== currentStep) {
    return <Navigate to={`/onboarding/${plan.data.id}/${allowed}`} replace />
  }

  const context: OnboardingContext = { plan: plan.data, quote: journey.quote }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <Stepper
          planId={plan.data.id}
          current={currentStep}
          maxReachable={maxReachableIndex(progress)}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <Outlet context={context} />
        </div>
        {currentStep !== 'result' && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary plan={plan.data} quote={journey.quote} />
          </aside>
        )}
      </div>
    </div>
  )
}

function OnboardingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Skeleton className="mb-8 h-8 w-full max-w-md" />
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-11 w-40" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
