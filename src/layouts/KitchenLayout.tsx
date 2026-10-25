import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { LogoutButton } from '../features/auth/components/LogoutButton'
export function KitchenLayout() {
  const user = useAppSelector((state) => state.auth.session?.user)
  return (
    <div lang="en" className="min-h-dvh bg-[#f4f5f1]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 bg-white px-5 py-3 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-lg font-black text-white">
            F
          </span>
          <div>
            <p className="font-bold">
              FOODHUB{' '}
              <span className="ml-2 text-xs font-medium text-muted">
                KITCHEN
              </span>
            </p>
            <p className="text-xs text-muted">Kitchen workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {user?.fullName || user?.userName}
          </span>
          <div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
