import { NavLink, Outlet } from 'react-router-dom'
import { BrandLogo } from '../../components/BrandLogo/BrandLogo'
import { useAppSelector } from '../../app/hooks'
import { LogoutButton } from '../../features/auth/components/LogoutButton'

export function CashierLayout() {
  const user = useAppSelector((state) => state.auth.session?.user)
  return (
    <div
      lang="vi"
      className="flex min-h-dvh flex-col bg-[#f3f6f4] text-slate-800"
    >
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#123d30] px-5 py-3 text-white sm:px-8">
        <div className="flex items-center gap-5">
          <BrandLogo />
          <span className="border-l border-white/20 pl-5 text-sm font-medium">
            Quầy thu ngân
          </span>
        </div>
        <details className="relative">
          <summary className="cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-sm">
            {user?.fullName || user?.userName}
          </summary>
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border bg-white p-2 shadow-lg">
            <LogoutButton compact />
          </div>
        </details>
      </header>
      <nav
        aria-label="Điều hướng thu ngân"
        className="flex flex-wrap gap-2 border-b border-slate-200 bg-white px-5 py-2"
      >
        <NavLink
          end
          to="/cashier"
          className="rounded-lg px-3 py-2 text-sm font-semibold aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-800"
        >
          Ca làm việc
        </NavLink>
        <NavLink
          to="/cashier/table-billing"
          className="rounded-lg px-3 py-2 text-sm font-semibold aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-800"
        >
          Bàn & hóa đơn
        </NavLink>
        <NavLink
          to="/cashier/takeaway-orders"
          className="rounded-lg px-3 py-2 text-sm font-semibold aria-[current=page]:bg-emerald-50 aria-[current=page]:text-emerald-800"
        >
          Đơn online
        </NavLink>
      </nav>
      <main className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-4">
        <Outlet />
      </main>
    </div>
  )
}
