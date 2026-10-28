import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Icon } from '../../components/Icon/Icon'
import { Modal } from '../../components/Modal/Modal'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useKitchen } from '../../features/kitchen/shared/hooks'
import { clearKitchenFeedback } from '../../features/kitchen/shared/kitchenSlice'
import { LogoutButton } from '../../features/auth/components/LogoutButton'
import { KitchenSidebar } from './components/KitchenSidebar'
import { kitchenNavigation } from './navigation'
import '../../features/kitchen/shared/kitchen.css'
export function KitchenLayout() {
  const { state } = useKitchen()
  const user = useAppSelector((s) => s.auth.session?.user)
  const displayName = user?.fullName || user?.userName || 'Kitchen'
  const dispatch = useAppDispatch()
  const [mobile, setMobile] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [logout, setLogout] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    const old = document.title
    document.title = 'FoodHub · Kitchen'
    return () => {
      document.title = old
    }
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    if (!state.feedback) return
    const timer = setTimeout(() => dispatch(clearKitchenFeedback()), 6500)
    return () => clearTimeout(timer)
  }, [state.feedback, dispatch])
  const sidebar = (small: boolean) => (
    <KitchenSidebar
      area={state.area}
      collapsed={small}
      onNavigate={() => setMobile(false)}
      onLogout={() => {
        setMobile(false)
        setLogout(true)
      }}
    />
  )
  return (
    <div lang="en" className="min-h-dvh bg-[#f2f8fa] text-[#253754]">
      <a
        href="#kitchen-main"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-4"
      >
        Skip to main content
      </a>
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden lg:block ${collapsed ? 'w-18' : 'w-68'}`}
      >
        {sidebar(collapsed)}
      </aside>
      <div className={collapsed ? 'lg:pl-18' : 'lg:pl-68'}>
        <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              className="rounded-lg p-2 hover:bg-slate-100"
              onClick={() => {
                if (matchMedia('(min-width:1024px)').matches)
                  setCollapsed((v) => !v)
                else setMobile(true)
              }}
            >
              <Icon name="menu" />
            </button>
            <span className="text-sm text-slate-500">
              Kitchen /{' '}
              <strong className="text-slate-800">
                {kitchenNavigation.find(
                  ([p]) => pathname === '/kitchen' + (p ? '/' + p : ''),
                )?.[1] || 'KDS'}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              ● Signed in
            </span>
            <Link
              to="/kitchen/notifications"
              aria-label="View notifications"
              className="relative rounded-full bg-slate-50 p-2"
            >
              <Icon name="bell" />
              <span className="absolute -top-1 -right-1 rounded-full bg-rose-600 px-1 text-[10px] text-white">
                {
                  state.notifications.filter(
                    (n) =>
                      n.status !== 'simulated' &&
                      state.tickets.some(
                        (t) =>
                          t.id === n.ticket &&
                          state.recipes.some(
                            (r) => r.id === t.dishId && r.area === state.area,
                          ),
                      ),
                  ).length
                }
              </span>
            </Link>
            <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm text-emerald-800">
              {displayName}
            </span>
          </div>
        </header>
        <main id="kitchen-main" className="mx-auto max-w-[1760px] p-3 sm:p-6">
          <Outlet />
        </main>
        <footer className="px-6 py-5 text-xs leading-5 text-slate-400">
          FoodHub · KDS {state.area} · Sample data resets when you reload
          the page. QR, waiter and inventory systems are not connected.
        </footer>
      </div>
      {state.feedback && (
        <div
          role={state.feedback.error ? 'alert' : 'status'}
          className={`fixed right-4 bottom-4 z-40 flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl p-4 text-sm text-white shadow-xl sm:max-w-sm ${state.feedback.error ? 'bg-rose-800' : 'bg-slate-900'}`}
        >
          <span>{state.feedback.text}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => dispatch(clearKitchenFeedback())}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      {mobile && (
        <Modal closeLabel="Close" title="Kitchen navigation" onClose={() => setMobile(false)}>
          <div className="h-[75dvh]">{sidebar(false)}</div>
        </Modal>
      )}
      {logout && (
        <Modal closeLabel="Close" title="Sign out of Kitchen" onClose={() => setLogout(false)}>
          <div className="space-y-4 p-6">
            <p>
              Sign out of your Kitchen account?
            </p>
            <LogoutButton />
          </div>
        </Modal>
      )}
    </div>
  )
}
