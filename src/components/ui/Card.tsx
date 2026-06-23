import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** Surface container with consistent radius, border and padding. */
export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-border bg-surface',
        className,
      )}
      {...props}
    />
  )
}
