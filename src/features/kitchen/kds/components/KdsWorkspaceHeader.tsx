import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { LogoutButton } from '../../../auth/components/LogoutButton'
import { useKds } from '../hooks/useKds'

export function KdsWorkspaceHeader() {
  const { stations, stationId, setStationId, refresh, pending } = useKds()
  const user = useAppSelector((state) => state.auth.session?.user)
  const displayName = user?.fullName || user?.userName || 'Bếp'
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && accountOpen) {
        setAccountOpen(false)
        accountButtonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountOpen])

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white px-3 py-2 sm:gap-3 sm:px-5 lg:h-[68px] lg:flex-nowrap lg:py-0">
      <Link
        to="/kitchen"
        aria-label="FoodHub - Bếp"
        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-emerald-700 transition-colors hover:bg-emerald-50"
      >
        <Icon name="leaf" size={23} />
      </Link>
      <div className="min-w-0 flex-1">
        <nav
          aria-label="Đường dẫn điều hướng"
          className="flex items-center gap-1.5 text-sm leading-5"
        >
          <Link to="/kitchen" className="text-slate-500 hover:text-emerald-700">
            FoodHub
          </Link>
          <Icon name="chevron" size={12} className="text-slate-400" />
          <span aria-current="page" className="font-medium text-emerald-700">
            Màn hình bếp
          </span>
        </nav>
        <p className="truncate text-base font-semibold leading-5 tracking-tight text-[#253754]">
          Không gian làm việc bếp
        </p>
      </div>
      <div className="ml-auto flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
        <select
          aria-label="Trạm bếp"
          value={stationId}
          disabled={pending || !stations.length}
          onChange={(event) => setStationId(event.target.value)}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:max-w-56"
        >
          {!stations.length && <option value="">Chưa có trạm bếp</option>}
          {stations.map((station) => (
            <option
              key={station.kitchenStationId}
              value={station.kitchenStationId}
            >
              {station.kitchenStationName}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-label="Làm mới dữ liệu bếp"
          title="Làm mới dữ liệu bếp"
          disabled={pending}
          onClick={refresh}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40"
        >
          <Icon name="activity" size={21} />
        </button>
        <div
          ref={accountRef}
          className="relative"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setAccountOpen(false)
          }}
        >
          <button
            ref={accountButtonRef}
            type="button"
            aria-label="Mở menu tài khoản"
            aria-expanded={accountOpen}
            aria-controls="kitchen-account-dropdown"
            onClick={() => setAccountOpen((open) => !open)}
            className="flex min-h-11 items-center gap-2 rounded-xl px-1.5 text-slate-600 transition-colors hover:bg-slate-50 sm:gap-2.5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden max-w-44 truncate text-base font-semibold sm:block">
              {displayName}
            </span>
            <Icon
              name="chevron"
              size={14}
              className={`text-slate-400 transition-transform ${accountOpen ? '-rotate-90' : 'rotate-90'}`}
            />
          </button>
          {accountOpen && (
            <div
              id="kitchen-account-dropdown"
              className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_12px_40px_#18352a14]"
            >
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="break-words text-base font-semibold text-[#344760]">
                  {displayName}
                </p>
                <p className="mt-1 break-words text-sm text-slate-500">
                  {user?.email}
                </p>
              </div>
              <div className="p-2">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
