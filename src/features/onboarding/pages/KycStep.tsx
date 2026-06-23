import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { kycSchema } from '../schemas'
import type { KycForm } from '../schemas'
import { useJourneyStore } from '../journeyStore'
import { useOnboarding } from '../useOnboarding'
import { Field, TextInput } from '@/components/ui/form'
import { StepHeading, StepCard, StepActions } from '../components/StepShell'

export default function KycStep() {
  const { plan } = useOnboarding()
  const navigate = useNavigate()
  const kyc = useJourneyStore((s) => s.kyc)
  const setKyc = useJourneyStore((s) => s.setKyc)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<KycForm>({
    resolver: zodResolver(kycSchema),
    defaultValues: kyc ?? { pan: '', dateOfBirth: '' },
  })

  const onSubmit = (data: KycForm) => {
    setKyc(data)
    navigate(`/onboarding/${plan.id}/personal`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepHeading
        title="Identity verification (KYC)"
        description="We need a few details to verify your identity, as required for insurance."
      />
      <StepCard>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="PAN"
            htmlFor="pan"
            required
            error={errors.pan?.message}
            hint="Format: ABCDE1234F"
          >
            <TextInput
              id="pan"
              placeholder="ABCDE1234F"
              maxLength={10}
              autoCapitalize="characters"
              className="uppercase"
              invalid={Boolean(errors.pan)}
              {...register('pan')}
            />
          </Field>
          <Field
            label="Date of birth"
            htmlFor="dateOfBirth"
            required
            error={errors.dateOfBirth?.message}
          >
            <TextInput
              id="dateOfBirth"
              type="date"
              invalid={Boolean(errors.dateOfBirth)}
              {...register('dateOfBirth')}
            />
          </Field>
        </div>
      </StepCard>
      <StepActions backTo={`/plans/${plan.id}`} isSubmitting={isSubmitting} />
    </form>
  )
}
