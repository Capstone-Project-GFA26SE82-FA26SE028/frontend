import { Link } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { StaffNavLink } from './StaffNavLink'
import { StaffSidebarProfile } from './StaffSidebarProfile'
import type { StaffNavigationGroup } from '../types/types'

export function StaffSidebar({
  groups,
  homePath,
  roleLabel,
  collapsed,
  onNavigate,
}: {
  groups: StaffNavigationGroup[]
  homePath: string
  roleLabel: string
  collapsed: boolean
  onNavigate: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-[#003b2e] bg-linear-to-br from-[#00382b] via-[#00382d] to-[#002e28] text-white">
      <Link
        to={homePath}
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
            <p className="text-xs text-white/85">Nền tảng quản lý nhà hàng</p>
          </div>
        )}
      </Link>
      <nav
        aria-label="Điều hướng nhân viên"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {groups.map((group, index) => (
          <div key={group.title || index}>
            {group.title && !collapsed && (
              <p className="mb-2 px-3 text-xs font-medium tracking-[.04em] text-white/60">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <StaffNavLink
                  key={item.to}
                  item={item}
                  homePath={homePath}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <StaffSidebarProfile collapsed={collapsed} roleLabel={roleLabel} />
    </div>
  )
}
