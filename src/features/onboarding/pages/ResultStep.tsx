import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../useOnboarding'
import { useJourneyStore } from '../journeyStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/format'

export default function ResultStep() {
  const { plan, quote } = useOnboarding()
  const navigate = useNavigate()
  const payment = useJourneyStore((s) => s.payment)
  const reset = useJourneyStore((s) => s.reset)

  const startFresh = () => {
    reset()
    navigate('/')
  }

  // Guard normally prevents reaching here without a payment, but be defensive.
  if (!payment) {
    return (
      <Card className="p-8 text-center">
        <p className="text-fg-muted">No payment found.</p>
        <Button className="mt-4" onClick={startFresh}>
          Back to plans
        </Button>
      </Card>
    )
  }

  if (payment.status === 'failed') {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-danger/15 text-3xl">
          ✕
        </div>
        <h1 className="mt-4 text-2xl font-bold text-fg">Payment failed</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-fg-muted">
          We couldn’t process your payment of{' '}
          {formatCurrency(payment.amount)}. No money was deducted. You can try
          again.
        </p>
        <p className="mt-2 text-xs text-fg-muted">Reference: {payment.referenceId}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => navigate(`/onboarding/${plan.id}/payment`)}>
            Retry payment
          </Button>
          <Button variant="outline" onClick={startFresh}>
            Cancel
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-3xl text-success">
        ✓
      </div>
      <h1 className="mt-4 text-2xl font-bold text-fg">You’re covered! 🎉</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-fg-muted">
        Your {plan.name} policy is active. A confirmation has been sent to your
        email.
      </p>

      <dl className="mx-auto mt-6 max-w-sm space-y-2.5 rounded-xl border border-border bg-surface-2 p-4 text-left text-sm">
        <Row label="Policy reference" value={payment.referenceId} mono />
        <Row label="Plan" value={plan.name} />
        <Row label="Cover amount" value={formatCurrency(quote.coverAmount)} />
        <Row label="Premium paid" value={`${formatCurrency(payment.amount)}/yr`} />
        <Row label="Date" value={formatDate(new Date(payment.paidAt).toISOString())} />
      </dl>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={startFresh}>Browse more plans</Button>
      </div>
    </Card>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-fg-muted">{label}</dt>
      <dd className={mono ? 'font-mono text-xs font-semibold text-fg' : 'font-medium text-fg'}>
        {value}
      </dd>
    </div>
  )
}
