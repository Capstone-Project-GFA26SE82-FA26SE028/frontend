import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { Icon } from '../../../components/Icon/Icon'
import { LogoutButton } from '../../../features/auth/components/LogoutButton'

export function KitchenHeader({
  onMenu,
  expanded,
}: {
  onMenu: () => void
  expanded: boolean
}) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const name = user?.fullName || user?.userName || 'Kitchen staff'
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const accountButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!accountRef.current?.contains(event.target as Node))
        setAccountOpen(false)
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && accountOpen) {
        setAccountOpen(false)
        accountButton.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    window.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      window.removeEventListener('keydown', escape)
    }
  }, [accountOpen])

  return (
    <header className="sticky top-0 z-20 flex min-h-[68px] items-center gap-3 border-b border-slate-100 bg-white px-3 sm:px-5">
      <button
        aria-label="Toggle navigation"
        aria-expanded={expanded}
        aria-controls="kitchen-sidebar"
        onClick={onMenu}
        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <Icon name="menu" />
      </button>
      <div className="min-w-0 flex-1">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs"
        >
          <Link
            to="/kitchen/kds"
            className="text-slate-400 hover:text-emerald-700"
          >
            FoodHub
          </Link>
          <Icon name="chevron" size={11} className="text-slate-300" />
          <span aria-current="page" className="text-emerald-700">
            Kitchen Display
          </span>
        </nav>
        <p className="mt-0.5 text-base font-semibold tracking-tight">
          Kitchen workspace
        </p>
      </div>
      <span className="hidden items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
        <Icon name="shield" size={14} />
        Kitchen staff
      </span>
      <div
        ref={accountRef}
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setAccountOpen(false)
        }}
      >
        <button
          ref={accountButton}
          aria-label="Open account menu"
          aria-expanded={accountOpen}
          aria-controls="kitchen-account-menu"
          onClick={() => setAccountOpen((value) => !value)}
          className="flex min-h-11 items-center gap-2 rounded-xl px-2 hover:bg-slate-50"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden max-w-40 truncate text-sm font-semibold md:block">
            {name}
          </span>
          <Icon
            name="chevron"
            size={13}
            className={accountOpen ? '-rotate-90' : 'rotate-90'}
          />
        </button>
        {accountOpen && (
          <div
            id="kitchen-account-menu"
            className="absolute right-0 top-[calc(100%+8px)] w-60 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="font-semibold">{name}</p>
              <p className="mt-1 break-all text-xs text-slate-500">
                {user?.email}
              </p>
            </div>
            <div className="p-2">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
