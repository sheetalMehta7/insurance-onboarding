import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Plan } from '@/types'
import { defaultQuote } from '../quote'
import { formatCurrency } from '@/lib/format'

/** Horizontally swipeable highlight strip of featured plans. */
export function FeaturedCarousel({ plans }: { plans: Plan[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const amount = track.clientWidth * 0.8 * dir
    track.scrollBy({ left: amount, behavior: 'smooth' })
  }

  if (plans.length === 0) return null

  return (
    <section aria-label="Featured plans" className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-fg">Featured plans</h2>
        <div className="flex gap-2">
          <CarouselButton direction="prev" onClick={() => scrollBy(-1)} />
          <CarouselButton direction="next" onClick={() => scrollBy(1)} />
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {plans.map((plan) => (
          <FeaturedSlide key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  )
}

function FeaturedSlide({ plan }: { plan: Plan }) {
  const quote = defaultQuote(plan)
  return (
    <Link
      to={`/plans/${plan.id}`}
      className="group relative flex min-h-44 w-[85%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-6 text-brand-contrast sm:w-[60%] lg:w-[48%]"
      style={{
        backgroundImage:
          'linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%)',
      }}
    >
      <span
        className="pointer-events-none absolute -right-6 -top-8 text-[7rem] opacity-20"
        aria-hidden="true"
      >
        {plan.icon}
      </span>
      <div className="relative">
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
          {plan.category}
        </span>
        <h3 className="mt-3 text-xl font-bold">{plan.name}</h3>
        <p className="mt-1 max-w-sm text-sm text-brand-contrast/85">
          {plan.tagline}
        </p>
      </div>
      <div className="relative mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-brand-contrast/80">Starting at</p>
          <p className="text-lg font-bold">
            {formatCurrency(quote.annualPremium)}
            <span className="text-sm font-normal text-brand-contrast/80">/yr</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold transition-colors group-hover:bg-white/25">
          View plan
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
            <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

function CarouselButton({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous featured plans' : 'Next featured plans'}
      className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-fg transition-colors hover:bg-surface-2"
    >
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
        <path
          d={direction === 'prev' ? 'M12 5l-5 5 5 5' : 'M8 5l5 5-5 5'}
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
