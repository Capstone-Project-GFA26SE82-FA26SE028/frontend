import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { restoreSession } from '../../features/auth/api/authApi'
import { LogoutButton } from '../../features/auth/components/LogoutButton'
import { Icon } from '../Icon/Icon'

export function HomeHeader() {
  const { session, status } = useAppSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const user = status === 'authenticated' ? session?.user : null
  const name = user?.fullName || user?.userName || 'Tài khoản'

  useEffect(() => {
    if (status === 'checking') void restoreSession()
  }, [status])

  useEffect(() => {
    if (!open) return
    function closeOutside(event: PointerEvent) {
      if (!accountRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-7">
      <Link
        to="/"
        aria-label="FoodHub - Trang chủ"
        className="shrink-0 text-xl font-bold tracking-tight sm:text-2xl"
      >
        FoodHub<span className="text-emerald-500">.</span>
      </Link>

      {status === 'checking' ? (
        <p role="status" className="text-xs text-muted">
          Đang kiểm tra tài khoản…
        </p>
      ) : status === 'error' && session ? (
        <Link
          to="/login"
          className="rounded-full border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold hover:bg-emerald-50"
        >
          Kiểm tra tài khoản
        </Link>
      ) : user ? (
        <div ref={accountRef} className="relative min-w-0 max-w-[60%]">
          <button
            ref={buttonRef}
            type="button"
            aria-label={'Tài khoản ' + name}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
            className="flex min-h-11 max-w-full items-center gap-2 rounded-full border border-stone-200/80 bg-white py-1.5 pr-3 pl-1.5 text-sm font-semibold transition-colors hover:border-emerald-200 hover:bg-emerald-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800"
            >
              {name.trim().slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate">{name}</span>
            <Icon
              name="chevron"
              size={14}
              className={`shrink-0 text-slate-400 transition-transform ${open ? '-rotate-90' : 'rotate-90'}`}
            />
          </button>
          {open && (
            <div
              id={panelId}
              className="absolute top-[calc(100%+6px)] right-0 z-30 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-lg shadow-stone-900/10"
            >
              <div className="border-b border-stone-100 bg-stone-50/70 px-4 py-3">
                <p className="truncate text-sm font-semibold" title={name}>
                  {name}
                </p>
                <p
                  className="mt-1 truncate text-xs text-muted"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
              <div className="p-1.5">
                <LogoutButton compact />
              </div>
            </div>
          )}
        </div>
      ) : (
        <nav
          aria-label="Tài khoản"
          className="flex shrink-0 items-center gap-2"
        >
          <Link
            to="/login"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-3 text-xs font-semibold transition-colors hover:border-emerald-300 hover:bg-emerald-50 sm:px-4 sm:text-sm"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-dark sm:px-4 sm:text-sm"
          >
            Đăng ký
          </Link>
        </nav>
      )}
    </header>
  )
}
