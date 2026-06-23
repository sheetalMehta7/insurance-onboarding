import type { ReactNode } from 'react'
import { Button } from './Button'

/** Generic centered message for empty / error / not-found states. */
function StateBlock({
  icon,
  title,
  message,
  action,
}: {
  icon: string
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-border bg-surface px-6 py-14 text-center">
      <span className="text-4xl" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      <p className="max-w-sm text-sm text-fg-muted">{message}</p>
      {action}
    </div>
  )
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'No items match your filters.',
  icon = '🔍',
}: {
  title?: string
  message?: string
  icon?: string
}) {
  return <StateBlock icon={icon} title={title} message={message} />
}

export function ErrorState({
  message = 'Something went wrong while loading data.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <StateBlock
      icon="⚠️"
      title="We hit a snag"
      message={message}
      action={
        onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
    />
  )
}
