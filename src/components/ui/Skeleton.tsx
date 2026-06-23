import { cn } from '@/lib/cn'

/** Shimmer placeholder used while data loads. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-2', className)}
      aria-hidden="true"
    />
  )
}
