import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

/** Heading block shared by every step. */
export function StepHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-fg">{title}</h1>
      <p className="mt-1 text-sm text-fg-muted">{description}</p>
    </div>
  )
}

/** Back / Continue footer. `backTo` enables the Back button. */
export function StepActions({
  backTo,
  submitLabel = 'Continue',
  isSubmitting = false,
}: {
  backTo?: string
  submitLabel?: string
  isSubmitting?: boolean
}) {
  const navigate = useNavigate()
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {backTo ? (
        <Button type="button" variant="ghost" onClick={() => navigate(backTo)}>
          ← Back
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </div>
  )
}

/** Card container for a step's form content. */
export function StepCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 sm:p-6">
      {children}
    </div>
  )
}
