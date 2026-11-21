import { Outlet } from 'react-router-dom'
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
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <Outlet />
      </main>
      <footer className="px-6 py-4 text-center text-xs text-slate-500">
        DineLink · Không gian thu ngân
      </footer>
    </div>
  )
}
