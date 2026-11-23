import { Link } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { BrandLogo } from '../../../components/BrandLogo/BrandLogo'
import { CustomerNotifications } from '../../../features/customer/notifications/components/CustomerNotifications'
import { ServiceRequestButton } from '../../../features/customer/service-requests/components/ServiceRequestButton'
import { navigation } from '../navigation'
import { CustomerNavLink } from './CustomerNavLink'

export function CustomerHeader({ count }: { count: number }) {
  return (
    <>
      <header className="sticky top-0 z-20 isolate border-b border-white/10 bg-brand-dark">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8 lg:px-12">
          <Link
            to="/menu"
            aria-label="DineLink – Thực đơn"
            className="flex items-center gap-2.5"
          >
            <BrandLogo />
          </Link>
          <nav
            aria-label="Điều hướng chính"
            className="fixed right-0 bottom-0 left-0 z-20 flex justify-around border-t border-stone-200 bg-white px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:items-center md:justify-start md:gap-7 md:border-0 md:bg-transparent md:p-0"
          >
            {navigation.map((n) => (
              <CustomerNavLink
                key={n.to}
                to={n.to}
                label={n.label}
                icon={n.icon}
              />
            ))}
            <CustomerNavLink
              to="/cart"
              label={`Giỏ hàng (${count})`}
              icon="bag"
              mobileOnly
            />
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <ServiceRequestButton />
            <Link
              to="/cart"
              className="relative hidden min-h-11 items-center gap-2 rounded-full border border-white/20 bg-brand px-4 py-3 text-sm font-semibold text-white md:flex"
            >
              <Icon name="bag" size={19} />
              <span className="hidden lg:inline">Giỏ hàng</span>
              <span
                className="flex size-5 items-center justify-center rounded-full bg-white text-[11px] text-brand"
                aria-label={`${count} món trong giỏ`}
              >
                {count}
              </span>
            </Link>
            <CustomerNotifications />
          </div>
        </div>
      </header>
    </>
  )
}
