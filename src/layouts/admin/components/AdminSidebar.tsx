import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { adminNavigation } from '../navigation'
import { AdminNavLink } from './AdminNavLink'
import { AdminSidebarProfile } from './AdminSidebarProfile'
export function AdminSidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const { hash, pathname } = useLocation()
  const activeId = pathname.split('/')[2] || hash.slice(1) || 'overview'
  return (
    <div className="flex h-full flex-col bg-[#003b2e] bg-linear-to-br from-[#00382b] via-[#00382d] to-[#002e28] text-white">
      <Link
        to="/admin"
        onClick={onNavigate}
        aria-label="FoodHub - Tổng quan"
        className={`flex min-h-[76px] shrink-0 items-center gap-3 ${collapsed ? 'justify-center' : 'px-6'}`}
      >
        <span className="relative flex size-10 shrink-0 rotate-[-15deg] items-center justify-center rounded-[40%] border-2 border-lime-300/60 bg-linear-to-br from-lime-400 to-emerald-600 text-[#004c32] shadow-[3px_2px_0_#7ddc5740]">
          <Icon name="leaf" size={29} />
        </span>
        {!collapsed && (
          <div>
            <span className="text-[23px] font-bold leading-7 tracking-tight">
              FoodHub
            </span>
            <p className="text-xs text-white/85">
              Nền tảng quản lý nhiều nhà hàng
            </p>
          </div>
        )}
      </Link>
      <nav
        aria-label="Điều hướng Admin"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {adminNavigation.map((g, i) => (
          <div key={i}>
            {g.title && !collapsed && (
              <p className="mb-2 px-3 text-xs font-medium tracking-[.04em] text-white/60">
                {g.title}
              </p>
            )}
            <div className="space-y-0.5">
              {g.items.map((n) => (
                <AdminNavLink
                  key={n.id}
                  {...n}
                  active={activeId === n.id}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <AdminSidebarProfile collapsed={collapsed} />
    </div>
  )
}
