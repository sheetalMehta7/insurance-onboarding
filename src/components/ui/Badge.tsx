import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'brand' | 'success' | 'warning'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-fg-muted',
  brand: 'bg-brand-soft text-brand',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
}

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
