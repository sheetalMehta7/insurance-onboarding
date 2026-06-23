import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { personalSchema } from '../schemas'
import type { PersonalForm } from '../schemas'
import { useJourneyStore } from '../journeyStore'
import { useOnboarding } from '../useOnboarding'
import { useAuthStore } from '@/features/auth/authStore'
import { Field, TextInput, Select } from '@/components/ui/form'
import { StepHeading, StepCard, StepActions } from '../components/StepShell'

export default function PersonalStep() {
  const { plan } = useOnboarding()
  const navigate = useNavigate()
  const personal = useJourneyStore((s) => s.personal)
  const setPersonal = useJourneyStore((s) => s.setPersonal)
  const session = useAuthStore((s) => s.session)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: personal ?? {
      fullName: '',
      email: '',
      gender: 'male',
      // Pre-fill the verified phone from the session.
      phone: session?.user.phone ?? '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
    },
  })

  const onSubmit = (data: PersonalForm) => {
    setPersonal(data)
    navigate(`/onboarding/${plan.id}/nominee`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepHeading
        title="Your details"
        description="Tell us about the person being insured (the proposer)."
      />
      <StepCard>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="fullName" required error={errors.fullName?.message}>
            <TextInput id="fullName" autoComplete="name" placeholder="Jane Doe" invalid={Boolean(errors.fullName)} {...register('fullName')} />
          </Field>
          <Field label="Email" htmlFor="email" required error={errors.email?.message}>
            <TextInput id="email" type="email" autoComplete="email" placeholder="jane@example.com" invalid={Boolean(errors.email)} {...register('email')} />
          </Field>
          <Field label="Gender" htmlFor="gender" required error={errors.gender?.message}>
            <Select id="gender" invalid={Boolean(errors.gender)} {...register('gender')}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Mobile number" htmlFor="phone" required error={errors.phone?.message}>
            <TextInput id="phone" inputMode="numeric" maxLength={10} placeholder="9876543210" invalid={Boolean(errors.phone)} {...register('phone')} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address" htmlFor="addressLine" required error={errors.addressLine?.message}>
              <TextInput id="addressLine" autoComplete="street-address" placeholder="Flat / House, Street" invalid={Boolean(errors.addressLine)} {...register('addressLine')} />
            </Field>
          </div>
          <Field label="City" htmlFor="city" required error={errors.city?.message}>
            <TextInput id="city" autoComplete="address-level2" invalid={Boolean(errors.city)} {...register('city')} />
          </Field>
          <Field label="State" htmlFor="state" required error={errors.state?.message}>
            <TextInput id="state" autoComplete="address-level1" invalid={Boolean(errors.state)} {...register('state')} />
          </Field>
          <Field label="Pincode" htmlFor="pincode" required error={errors.pincode?.message}>
            <TextInput id="pincode" inputMode="numeric" maxLength={6} placeholder="560001" invalid={Boolean(errors.pincode)} {...register('pincode')} />
          </Field>
        </div>
      </StepCard>
      <StepActions backTo={`/onboarding/${plan.id}/kyc`} isSubmitting={isSubmitting} />
    </form>
  )
}
