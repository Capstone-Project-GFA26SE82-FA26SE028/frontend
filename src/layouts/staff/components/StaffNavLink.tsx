import { NavLink } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import type { StaffNavigationItem } from '../types/types'

export function StaffNavLink({
  item,
  homePath,
  collapsed,
  onNavigate,
}: {
  item: StaffNavigationItem
  homePath: string
  collapsed: boolean
  onNavigate: () => void
}) {
  return (
    <NavLink
      to={item.to}
      end={item.to === homePath}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition lg:min-h-10 ${isActive ? 'bg-[#0b694a] font-semibold text-white' : 'text-white/85 hover:bg-white/10'} ${collapsed ? 'justify-center' : ''}`
      }
    >
      <Icon name={item.icon} size={17} />
      <span className={collapsed ? 'sr-only' : 'whitespace-nowrap'}>
        {item.label}
      </span>
    </NavLink>
  )
}
