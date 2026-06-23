import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { nomineeSchema } from '../schemas'
import type { NomineeForm } from '../schemas'
import { useJourneyStore } from '../journeyStore'
import { useOnboarding } from '../useOnboarding'
import { Field, TextInput, Select } from '@/components/ui/form'
import { StepHeading, StepCard, StepActions } from '../components/StepShell'

export default function NomineeStep() {
  const { plan } = useOnboarding()
  const navigate = useNavigate()
  const nominee = useJourneyStore((s) => s.nominee)
  const setNominee = useJourneyStore((s) => s.setNominee)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NomineeForm>({
    resolver: zodResolver(nomineeSchema),
    defaultValues: nominee ?? {
      fullName: '',
      relation: 'spouse',
      dateOfBirth: '',
      sharePercent: 100,
    },
  })

  const onSubmit = (data: NomineeForm) => {
    setNominee(data)
    navigate(`/onboarding/${plan.id}/review`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepHeading
        title="Nominee details"
        description="Who should receive the benefit? You can add a single nominee for this demo."
      />
      <StepCard>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nominee name" htmlFor="nomineeName" required error={errors.fullName?.message}>
            <TextInput id="nomineeName" placeholder="John Doe" invalid={Boolean(errors.fullName)} {...register('fullName')} />
          </Field>
          <Field label="Relation" htmlFor="relation" required error={errors.relation?.message}>
            <Select id="relation" invalid={Boolean(errors.relation)} {...register('relation')}>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Date of birth" htmlFor="nomineeDob" required error={errors.dateOfBirth?.message}>
            <TextInput id="nomineeDob" type="date" invalid={Boolean(errors.dateOfBirth)} {...register('dateOfBirth')} />
          </Field>
          <Field label="Share (%)" htmlFor="sharePercent" required error={errors.sharePercent?.message} hint="Percentage of the sum assured">
            <TextInput id="sharePercent" type="number" min={1} max={100} invalid={Boolean(errors.sharePercent)} {...register('sharePercent', { valueAsNumber: true })} />
          </Field>
        </div>
      </StepCard>
      <StepActions backTo={`/onboarding/${plan.id}/personal`} isSubmitting={isSubmitting} />
    </form>
  )
}
