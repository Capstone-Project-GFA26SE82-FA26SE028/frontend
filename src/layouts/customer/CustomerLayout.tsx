import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useCustomerCart } from '../../features/customer/cart/hooks/useCustomerCart'
import { CustomerHeader } from './components/CustomerHeader'
import { CustomerFooter } from './components/CustomerFooter'
import { CustomerTableInfo } from './components/CustomerTableInfo'
export function CustomerLayout() {
  const { cart } = useCustomerCart()
  const count =
    cart.data?.items.reduce((sum, line) => sum + line.quantity, 0) || 0
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-4"
      >
        Đến nội dung chính
      </a>
      <CustomerHeader count={count} />
      <main
        id="noi-dung"
        className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-6 sm:px-8 lg:px-12"
      >
        <CustomerTableInfo />
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  )
}
