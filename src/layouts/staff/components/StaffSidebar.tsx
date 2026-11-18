import { Link } from 'react-router-dom'
import { BrandLogo } from '../../../components/BrandLogo/BrandLogo'
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
        aria-label="DineLink - Tổng quan"
        className={`flex min-h-[76px] shrink-0 items-center gap-3 ${collapsed ? 'justify-center' : 'px-6'}`}
      >
        {collapsed && <BrandLogo compact />}
        {!collapsed && (
          <div>
            <BrandLogo />
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
