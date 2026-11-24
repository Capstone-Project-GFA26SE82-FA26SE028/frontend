import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { restoreSession } from '../../features/auth/api/authApi'
import { LogoutButton } from '../../features/auth/components/LogoutButton'
import { Icon } from '../Icon/Icon'
import { BrandLogo } from '../BrandLogo/BrandLogo'

export function HomeHeader() {
  const { session, status } = useAppSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const [failedAvatar, setFailedAvatar] = useState<string>()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const navigationId = useId()
  const user = status === 'authenticated' ? session?.user : null
  const avatar = user?.avatarUrl
  const name = user?.fullName || user?.userName || 'Tài khoản'

  useEffect(() => {
    if (status === 'checking') void restoreSession()
  }, [status])

  useEffect(() => {
    if (!open && !menuOpen) return
    function closeOutside(event: PointerEvent) {
      if (!accountRef.current?.contains(event.target as Node)) setOpen(false)
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        setMenuOpen(false)
        if (open) buttonRef.current?.focus()
        else menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, menuOpen])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-white/10 bg-[#123d30] text-white shadow-[0_4px_20px_-12px_rgba(18,61,48,0.4)]"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:py-5">
        <Link
          to="/"
          aria-label="DineLink - Trang chủ"
          className="mr-auto shrink-0 text-white [&>span]:w-28 lg:mr-0 lg:[&>span]:w-40"
        >
          <BrandLogo />
        </Link>

        <nav
          id={navigationId}
          aria-label="Điều hướng chính"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) setMenuOpen(false)
          }}
          className={`${menuOpen ? 'flex' : 'hidden'} order-last w-full flex-col gap-1 border-t border-white/15 pt-3 text-sm font-semibold lg:order-none lg:flex lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:border-0 lg:pt-0`}
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'rounded-xl bg-white/15 px-4 py-2.5 text-[#d7e9b7]'
                : 'rounded-xl px-4 py-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              isActive
                ? 'rounded-xl bg-white/15 px-4 py-2.5 text-[#d7e9b7]'
                : 'rounded-xl px-4 py-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            }
          >
            Nhà hàng
          </NavLink>
          <NavLink
            to="/reservation"
            className={({ isActive }) =>
              isActive
                ? 'rounded-xl bg-white/15 px-4 py-2.5 text-[#d7e9b7]'
                : 'rounded-xl px-4 py-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            }
          >
            Đặt bàn
          </NavLink>
          {!user && status === 'anonymous' && (
            <Link
              to="/register"
              className="rounded-xl px-4 py-2.5 text-[#d7e9b7] hover:bg-white/10 lg:hidden"
            >
              Đăng ký tài khoản
            </Link>
          )}
        </nav>

        {status === 'checking' ? (
          <p role="status" className="text-xs text-white/75">
            Đang kiểm tra tài khoản…
          </p>
        ) : status === 'error' && session ? (
          <Link
            to="/login"
            className="rounded-full border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#123d30] hover:bg-emerald-50"
          >
            Kiểm tra tài khoản
          </Link>
        ) : user ? (
          <div
            ref={accountRef}
            className="relative shrink-0 text-[#173e32] lg:min-w-0 lg:max-w-60"
          >
            <button
              ref={buttonRef}
              type="button"
              aria-label={'Tài khoản ' + name}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => {
                setOpen(!open)
                setMenuOpen(false)
              }}
              className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-auto lg:w-auto lg:min-h-11 lg:max-w-full lg:gap-2 lg:border-stone-200/80 lg:bg-white lg:py-1.5 lg:pr-3 lg:pl-1.5 lg:hover:bg-emerald-50"
            >
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-800"
              >
                {avatar &&
                /^https?:\/\//i.test(avatar) &&
                avatar !== failedAvatar ? (
                  <img
                    src={avatar}
                    alt=""
                    className="size-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedAvatar(avatar)}
                  />
                ) : (
                  name.trim().slice(0, 1).toUpperCase()
                )}
              </span>
              <span className="hidden truncate lg:block">{name}</span>
              <Icon
                name="chevron"
                size={14}
                className={`hidden shrink-0 text-slate-400 transition-transform lg:block ${open ? '-rotate-90' : 'rotate-90'}`}
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
                  {user.roleId === 'customer' && (
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex min-h-9 items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Icon name="users" size={16} />
                      Hồ sơ cá nhân
                    </Link>
                  )}
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
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/30 px-3 text-xs font-semibold text-white transition-colors hover:bg-white/10 sm:px-4 sm:text-sm"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="hidden min-h-10 items-center justify-center rounded-full bg-[#d7e9b7] px-3 text-xs font-semibold text-[#123d30] transition-colors hover:bg-white lg:inline-flex lg:px-4 lg:text-sm"
            >
              Đăng ký
            </Link>
          </nav>
        )}
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          aria-controls={navigationId}
          onClick={() => {
            setMenuOpen(!menuOpen)
            setOpen(false)
          }}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  )
}
