import { Link } from 'react-router-dom'
import type { Plan } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RatingStars } from './RatingStars'
import { defaultQuote } from '../quote'
import { formatCompactCurrency, formatCurrency } from '@/lib/format'

/** Plan tile used in the grid and (compact) in the featured carousel. */
export function PlanCard({ plan }: { plan: Plan }) {
  const quote = defaultQuote(plan)
  return (
    <Card className="group flex h-full flex-col p-5 transition-shadow hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid size-12 place-items-center rounded-xl bg-brand-soft text-2xl"
          aria-hidden="true"
        >
          {plan.icon}
        </span>
        <Badge tone="brand">{plan.category}</Badge>
      </div>

      <h3 className="mt-4 text-base font-bold text-fg">{plan.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{plan.tagline}</p>

      <div className="mt-3 flex items-center gap-3">
        <RatingStars rating={plan.rating} />
        <span className="text-xs text-fg-muted">
          {plan.claimSettlementRatio}% claims settled
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
        <div>
          <dt className="text-xs text-fg-muted">Cover up to</dt>
          <dd className="font-semibold text-fg">
            {formatCompactCurrency(plan.coverage.max)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-fg-muted">Starting at</dt>
          <dd className="font-semibold text-fg">
            {formatCurrency(quote.annualPremium)}
            <span className="font-normal text-fg-muted">/yr</span>
          </dd>
        </div>
      </dl>

      <Link
        to={`/plans/${plan.id}`}
        className="mt-5 inline-flex items-center justify-center gap-1 rounded-lg bg-surface-2 py-2.5 text-sm font-semibold text-fg transition-colors group-hover:bg-brand group-hover:text-brand-contrast"
      >
        View plan
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
          <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </Card>
  )
}
