import { Link } from 'react-router-dom'
import { PartnerLogo } from '@/features/partners/PartnerLogo'
import { PartnerSwitcher } from '@/features/partners/PartnerSwitcher'
import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { AccountMenu } from '@/features/auth/AccountMenu'

/** App header: brand lockup (home link), partner switcher and theme toggle. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          to="/"
          className="rounded-lg"
          aria-label="Go to home"
        >
          <PartnerLogo />
        </Link>

        <div className="flex items-center gap-2">
          <PartnerSwitcher />
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
