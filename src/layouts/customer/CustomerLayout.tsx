import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { CustomerHeader } from './components/CustomerHeader'
import { CustomerFooter } from './components/CustomerFooter'
import { CustomerTableInfo } from './components/CustomerTableInfo'
export function CustomerLayout() {
  const count = useAppSelector((s) =>
    s.cart.items.reduce((n, i) => n + i.quantity, 0),
  )
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return (
    <div className="min-h-dvh">
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-4"
      >
        Đến nội dung chính
      </a>
      <CustomerHeader count={count} />
      <main
        id="noi-dung"
        className="mx-auto max-w-[1440px] px-5 pb-6 sm:px-8 lg:px-12"
      >
        <CustomerTableInfo />
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  )
}
