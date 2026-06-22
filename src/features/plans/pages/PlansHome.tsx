import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePlans } from '../usePlans'
import { useActivePartner } from '@/features/partners/useActivePartner'
import { useDebouncedValue } from '@/lib/hooks'
import { PlanCard } from '../components/PlanCard'
import { PlanCardSkeleton } from '../components/PlanCardSkeleton'
import { FeaturedCarousel } from '../components/FeaturedCarousel'
import { EmptyState, ErrorState } from '@/components/ui/states'
import { cn } from '@/lib/cn'

const CATEGORIES = ['All', 'Term Life', 'Health', 'Motor', 'Travel', 'Home']

export default function PlansHome() {
  const partner = useActivePartner()
  const [params, setParams] = useSearchParams()
  const urlSearch = params.get('q') ?? ''
  const category = params.get('cat') ?? 'All'

  const [text, setText] = useState(urlSearch)
  const debounced = useDebouncedValue(text, 350)

  // Mirror the debounced search into the URL so the view is shareable and
  // survives a refresh (replace: no history spam while typing).
  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (debounced) next.set('q', debounced)
        else next.delete('q')
        return next
      },
      { replace: true },
    )
  }, [debounced, setParams])

  const setCategory = (cat: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (cat === 'All') next.delete('cat')
        else next.set('cat', cat)
        return next
      },
      { replace: true },
    )

  // Filtered list for the grid; unfiltered list feeds the featured carousel.
  const grid = usePlans(debounced, category)
  const all = usePlans()
  const featured = (all.data ?? []).filter((p) => p.featured)
  const isFiltering = Boolean(debounced) || category !== 'All'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          {partner.name}
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {partner.tagline}
        </h1>
        <p className="mt-3 max-w-xl text-fg-muted">
          Compare plans, configure your cover, and buy online in minutes.
        </p>
      </section>

      {/* Featured carousel (hidden while actively filtering) */}
      {!isFiltering && featured.length > 0 && (
        <div className="mb-12">
          <FeaturedCarousel plans={featured} />
        </div>
      )}

      {/* Catalog controls */}
      <section aria-label="All plans">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-fg">
            All plans
            {grid.data ? (
              <span className="ml-2 text-sm font-normal text-fg-muted">
                ({grid.data.length})
              </span>
            ) : null}
          </h2>
          <SearchBox value={text} onChange={setText} />
        </div>

        <div
          className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                category === cat
                  ? 'border-brand bg-brand text-brand-contrast'
                  : 'border-border bg-surface text-fg-muted hover:bg-surface-2',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* States */}
        {grid.isError ? (
          <ErrorState
            message={(grid.error as Error)?.message}
            onRetry={() => grid.refetch()}
          />
        ) : grid.isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        ) : grid.data && grid.data.length === 0 ? (
          <EmptyState
            title="No matching plans"
            message={`No ${partner.shortName} plans match your search. Try clearing filters.`}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grid.data?.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SearchBox({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative w-full sm:w-72">
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search plans…"
        aria-label="Search plans"
        className="h-11 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-fg-muted focus:border-brand"
      />
    </div>
  )
}
