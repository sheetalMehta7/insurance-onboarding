import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import type { Plan } from '@/types'
import { usePlan } from '../usePlans'
import { clampCover, clampTerm, computeQuote } from '../quote'
import { useJourneyStore } from '@/features/onboarding/journeyStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/states'
import { RatingStars } from '../components/RatingStars'
import {
  formatCompactCurrency,
  formatCurrency,
  formatYears,
} from '@/lib/format'

export default function PlanDetail() {
  const { planId = '' } = useParams()
  const { data: plan, isLoading, isError, refetch } = usePlan(planId)

  if (isLoading) return <DetailSkeleton />

  if (isError || !plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Plan not found"
          message="This plan isn’t available for the current partner."
        />
        <div className="mt-6 text-center">
          <Link to="/" className={buttonStyles({ variant: 'outline' })}>
            Back to plans
          </Link>
        </div>
        <div className="mt-3 text-center">
          <button onClick={() => refetch()} className="text-sm text-brand hover:underline">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <DetailContent plan={plan} />
}

function DetailContent({ plan }: { plan: Plan }) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const beginPurchase = useJourneyStore((s) => s.beginPurchase)

  // Cover & term live in the URL → the configured quote is shareable and
  // survives a refresh.
  const defaultTerm = plan.termOptions[Math.floor(plan.termOptions.length / 2)]
  const cover = clampCover(plan, Number(params.get('cover')) || plan.coverage.default)
  const term = clampTerm(plan, Number(params.get('term')) || defaultTerm)
  const quote = computeQuote(plan, { coverAmount: cover, termYears: term })

  const update = (key: 'cover' | 'term', value: number) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set(key, String(value))
        return next
      },
      { replace: true },
    )
  }

  const buyNow = () => {
    beginPurchase(plan.id, quote)
    // Go straight to the first step; ProtectedRoute redirects to login (with a
    // returnTo back here) if the user isn't authenticated yet.
    navigate(`/onboarding/${plan.id}/kyc`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="text-sm text-fg-muted hover:text-fg">
        ← All plans
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Details */}
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-3xl" aria-hidden="true">
              {plan.icon}
            </span>
            <div>
              <Badge tone="brand">{plan.category}</Badge>
              <h1 className="mt-2 text-2xl font-bold text-fg sm:text-3xl">{plan.name}</h1>
              <p className="mt-1 text-fg-muted">{plan.tagline}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <RatingStars rating={plan.rating} />
            <span className="text-fg-muted">
              {plan.claimSettlementRatio}% claims settled
            </span>
            <span className="text-fg-muted">
              Cover up to {formatCompactCurrency(plan.coverage.max)}
            </span>
          </div>

          <p className="mt-6 text-fg">{plan.description}</p>

          <Section title="Key benefits">
            <ul className="grid gap-3 sm:grid-cols-2">
              {plan.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-fg">
                  <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="What’s covered">
            <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {plan.coverageDetails.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-fg-muted">{row.label}</dt>
                  <dd className="text-right font-medium text-fg">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Exclusions">
            <ul className="grid gap-2">
              {plan.exclusions.map((ex) => (
                <li key={ex} className="flex items-start gap-2 text-sm text-fg-muted">
                  <span className="mt-0.5 text-danger" aria-hidden="true">✕</span>
                  {ex}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Configurator */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <h2 className="text-base font-bold text-fg">Configure your cover</h2>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label htmlFor="cover" className="text-sm font-medium text-fg">
                  Cover amount
                </label>
                <span className="text-sm font-bold text-brand">
                  {formatCurrency(cover)}
                </span>
              </div>
              <input
                id="cover"
                type="range"
                min={plan.coverage.min}
                max={plan.coverage.max}
                step={plan.coverage.step}
                value={cover}
                onChange={(e) => update('cover', Number(e.target.value))}
                className="mt-3 w-full"
                style={{ accentColor: 'var(--brand)' }}
              />
              <div className="mt-1 flex justify-between text-xs text-fg-muted">
                <span>{formatCompactCurrency(plan.coverage.min)}</span>
                <span>{formatCompactCurrency(plan.coverage.max)}</span>
              </div>
            </div>

            <div className="mt-5">
              <span className="text-sm font-medium text-fg">Policy term</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {plan.termOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update('term', opt)}
                    aria-pressed={term === opt}
                    className={
                      term === opt
                        ? 'rounded-lg border border-brand bg-brand px-3 py-1.5 text-sm font-semibold text-brand-contrast'
                        : 'rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg-muted hover:bg-surface-2'
                    }
                  >
                    {formatYears(opt)}
                  </button>
                ))}
              </div>
            </div>

            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-fg-muted">Base premium</dt>
                <dd className="font-medium text-fg">{formatCurrency(quote.basePremium)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fg-muted">GST ({Math.round(quote.taxRate * 100)}%)</dt>
                <dd className="font-medium text-fg">{formatCurrency(quote.tax)}</dd>
              </div>
            </dl>
            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
              <span className="text-sm font-medium text-fg">Total / year</span>
              <span className="text-2xl font-bold text-brand">
                {formatCurrency(quote.annualPremium)}
              </span>
            </div>

            <Button fullWidth size="lg" className="mt-5" onClick={buyNow}>
              Buy now
            </Button>
            <p className="mt-2 text-center text-xs text-fg-muted">
              You’ll sign in to complete the purchase.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold text-fg">{title}</h2>
      {children}
    </section>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="h-4 w-24" />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <Skeleton className="h-14 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}
