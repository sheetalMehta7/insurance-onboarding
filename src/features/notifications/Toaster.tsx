import { useToastStore } from './toast'
import type { ToastTone } from './toast'
import { cn } from '@/lib/cn'

const toneStyles: Record<ToastTone, string> = {
  info: 'border-border bg-surface text-fg',
  success: 'border-success/40 bg-surface text-fg',
  error: 'border-danger/40 bg-surface text-fg',
}

const toneIcon: Record<ToastTone, string> = {
  info: 'ℹ️',
  success: '✅',
  error: '⚠️',
}

/** Fixed, screen-reader-announced toast stack. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-black/10',
            toneStyles[t.tone],
          )}
          role={t.tone === 'error' ? 'alert' : 'status'}
        >
          <span aria-hidden="true">{toneIcon[t.tone]}</span>
          <p className="flex-1 text-sm">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="text-fg-muted hover:text-fg"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
