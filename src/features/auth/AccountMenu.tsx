import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore, useIsAuthenticated } from './authStore'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { useClickOutside } from '@/lib/hooks'

/** Header account control: sign-in link when logged out, menu when logged in. */
export function AccountMenu() {
  const session = useAuthStore((s) => s.session)
  const logout = useAuthStore((s) => s.logout)
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
  const authed = useIsAuthenticated()

  if (!authed) {
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return (
      <Link
        to={`/login?returnTo=${returnTo}`}
        className={buttonStyles({ variant: 'outline', size: 'sm' })}
      >
        Sign in
      </Link>
    )
  }

  const initials = session!.user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="relative" ref={ref} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-full bg-brand text-sm font-bold text-brand-contrast"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {initials}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-xl shadow-black/10"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-fg">{session!.user.name}</p>
            <p className="text-xs text-fg-muted">+91 {session!.user.phone}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              logout()
              navigate('/')
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-fg transition-colors hover:bg-surface-2"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
