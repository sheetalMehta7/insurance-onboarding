/** Compact numeric rating with a star glyph. */
export function RatingStars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold text-fg"
      aria-label={`Rated ${rating} out of 5`}
    >
      <svg viewBox="0 0 20 20" className="size-3.5 text-warning" aria-hidden="true">
        <path
          d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5Z"
          fill="currentColor"
        />
      </svg>
      {rating.toFixed(1)}
    </span>
  )
}
