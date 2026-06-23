import { Link, useNavigate } from 'react-router-dom'
import { useJourneyStore } from '../journeyStore'
import { useOnboarding } from '../useOnboarding'
import { StepHeading, StepCard, StepActions } from '../components/StepShell'
import { formatDate } from '@/lib/format'

const relationLabels: Record<string, string> = {
  spouse: 'Spouse',
  child: 'Child',
  parent: 'Parent',
  sibling: 'Sibling',
  other: 'Other',
}

export default function ReviewStep() {
  const { plan } = useOnboarding()
  const navigate = useNavigate()
  const { kyc, personal, nominee, confirmReview } = useJourneyStore()

  const onConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    confirmReview()
    navigate(`/onboarding/${plan.id}/payment`)
  }

  return (
    <form onSubmit={onConfirm}>
      <StepHeading
        title="Review & confirm"
        description="Please check everything is correct before payment."
      />

      <div className="space-y-4">
        <SummarySection
          title="Identity"
          editTo={`/onboarding/${plan.id}/kyc`}
          rows={[
            ['PAN', kyc?.pan ?? '—'],
            ['Date of birth', kyc ? formatDate(kyc.dateOfBirth) : '—'],
          ]}
        />
        <SummarySection
          title="Personal details"
          editTo={`/onboarding/${plan.id}/personal`}
          rows={[
            ['Name', personal?.fullName ?? '—'],
            ['Email', personal?.email ?? '—'],
            ['Gender', personal?.gender ?? '—'],
            ['Phone', personal ? `+91 ${personal.phone}` : '—'],
            [
              'Address',
              personal
                ? `${personal.addressLine}, ${personal.city}, ${personal.state} ${personal.pincode}`
                : '—',
            ],
          ]}
        />
        <SummarySection
          title="Nominee"
          editTo={`/onboarding/${plan.id}/nominee`}
          rows={[
            ['Name', nominee?.fullName ?? '—'],
            ['Relation', nominee ? relationLabels[nominee.relation] : '—'],
            ['Date of birth', nominee ? formatDate(nominee.dateOfBirth) : '—'],
            ['Share', nominee ? `${nominee.sharePercent}%` : '—'],
          ]}
        />
      </div>

      <StepActions
        backTo={`/onboarding/${plan.id}/nominee`}
        submitLabel="Confirm & pay"
      />
    </form>
  )
}

function SummarySection({
  title,
  editTo,
  rows,
}: {
  title: string
  editTo: string
  rows: [string, string][]
}) {
  return (
    <StepCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-fg-muted">
          {title}
        </h2>
        <Link to={editTo} className="text-sm font-medium text-brand hover:underline">
          Edit
        </Link>
      </div>
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-sm sm:flex-col sm:gap-0.5">
            <dt className="text-fg-muted">{label}</dt>
            <dd className="text-right font-medium text-fg sm:text-left capitalize">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </StepCard>
  )
}
