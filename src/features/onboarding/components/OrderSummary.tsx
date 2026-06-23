import type { Plan, Quote } from '@/types'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatYears } from '@/lib/format'

/** Sticky summary of the chosen plan + premium breakdown, shown alongside steps. */
export function OrderSummary({ plan, quote }: { plan: Plan; quote: Quote }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-2xl" aria-hidden="true">
          {plan.icon}
        </span>
        <div>
          <p className="text-xs text-fg-muted">{plan.category}</p>
          <h3 className="text-sm font-bold text-fg">{plan.name}</h3>
        </div>
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <Row label="Cover amount" value={formatCurrency(quote.coverAmount)} />
        <Row label="Policy term" value={formatYears(quote.termYears)} />
        <Row label="Base premium" value={formatCurrency(quote.basePremium)} />
        <Row
          label={`GST (${Math.round(quote.taxRate * 100)}%)`}
          value={formatCurrency(quote.tax)}
        />
      </dl>

      <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-fg">Total / year</span>
        <span className="text-xl font-bold text-brand">
          {formatCurrency(quote.annualPremium)}
        </span>
      </div>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="font-medium text-fg">{value}</dd>
    </div>
  )
}
