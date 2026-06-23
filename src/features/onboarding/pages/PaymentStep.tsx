import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../useOnboarding'
import { useJourneyStore } from '../journeyStore'
import { useActivePartner } from '@/features/partners/useActivePartner'
import {
  hasRazorpayKey,
  payWithRazorpay,
  makeReferenceId,
} from '@/features/payment/razorpay'
import { Button } from '@/components/ui/Button'
import { StepHeading, StepCard } from '../components/StepShell'
import { toast } from '@/features/notifications/toast'
import { formatCurrency } from '@/lib/format'
import type { PaymentStatus } from '@/types'

export default function PaymentStep() {
  const { plan, quote } = useOnboarding()
  const partner = useActivePartner()
  const navigate = useNavigate()
  const { personal, setPayment } = useJourneyStore()
  const [busy, setBusy] = useState(false)

  const finish = (status: PaymentStatus, referenceId: string, method?: string) => {
    setPayment({
      status,
      referenceId,
      paidAt: Date.now(),
      amount: quote.annualPremium,
      method,
    })
    navigate(`/onboarding/${plan.id}/result`)
  }

  const payReal = async () => {
    setBusy(true)
    try {
      const res = await payWithRazorpay({
        amount: quote.annualPremium,
        partnerName: partner.name,
        brandColor: partner.brand,
        description: `${plan.name} — ${formatCurrency(quote.coverAmount)} cover`,
        prefill: {
          name: personal?.fullName,
          email: personal?.email,
          contact: personal?.phone,
        },
      })
      finish('success', res.paymentId, res.method)
    } catch (err) {
      const reason = (err as Error).message
      if (reason === 'cancelled') {
        toast.info('Payment cancelled. You can try again.')
        setBusy(false)
        return
      }
      toast.error('Payment failed.')
      finish('failed', makeReferenceId(), 'razorpay')
    }
  }

  return (
    <div>
      <StepHeading
        title="Payment"
        description="Pay your annual premium securely to activate the policy."
      />

      <StepCard>
        <div className="flex items-center justify-between">
          <span className="text-fg-muted">Amount payable</span>
          <span className="text-2xl font-bold text-fg">
            {formatCurrency(quote.annualPremium)}
            <span className="text-sm font-normal text-fg-muted">/year</span>
          </span>
        </div>

        <div className="mt-6">
          {hasRazorpayKey() ? (
            <Button fullWidth size="lg" isLoading={busy} onClick={payReal}>
              Pay {formatCurrency(quote.annualPremium)} with Razorpay
            </Button>
          ) : (
            <MockGateway
              amount={quote.annualPremium}
              busy={busy}
              onPay={() => {
                setBusy(true)
                setTimeout(() => finish('success', makeReferenceId(), 'mock'), 700)
              }}
              onFail={() => {
                setBusy(true)
                setTimeout(() => {
                  toast.error('Payment failed.')
                  finish('failed', makeReferenceId(), 'mock')
                }, 700)
              }}
            />
          )}
        </div>

        <p className="mt-4 text-center text-xs text-fg-muted">
          🔒 {hasRazorpayKey() ? 'Razorpay sandbox' : 'Mock gateway'} — no real
          money is charged.
        </p>
      </StepCard>

      <div className="mt-8">
        <Button
          type="button"
          variant="ghost"
          disabled={busy}
          onClick={() => navigate(`/onboarding/${plan.id}/review`)}
        >
          ← Back
        </Button>
      </div>
    </div>
  )
}

/** Test gateway shown when no Razorpay key is configured. */
function MockGateway({
  amount,
  busy,
  onPay,
  onFail,
}: {
  amount: number
  busy: boolean
  onPay: () => void
  onFail: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Button fullWidth size="lg" isLoading={busy} onClick={onPay}>
        Pay {formatCurrency(amount)}
      </Button>
      <Button fullWidth variant="outline" disabled={busy} onClick={onFail}>
        Simulate a failed payment
      </Button>
    </div>
  )
}
