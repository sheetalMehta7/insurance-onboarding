import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export function PlanCardSkeleton() {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="size-12 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
      <Skeleton className="mt-5 h-10" />
    </Card>
  )
}
