import { NavLink } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { kitchenNavigation } from '../navigation'
export function KitchenSidebar({
  area,
  collapsed,
  onNavigate,
  onLogout,
}: {
  area: string
  collapsed: boolean
  onNavigate: () => void
  onLogout: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#003b2e] bg-linear-to-br from-[#00382b] to-[#002e28] p-3 text-white">
      <div className="flex min-h-14 shrink-0 items-center gap-3 px-2">
        <span className="rounded-xl bg-lime-300/20 p-2 text-lime-300">
          <Icon name="leaf" size={27} />
        </span>
        {!collapsed && (
          <div className="text-2xl font-bold">
            FoodHub
            <p className="text-xs font-normal text-white/60">
              Restaurant kitchen workspace
            </p>
          </div>
        )}
      </div>
      {!collapsed && (
        <div className="my-2 shrink-0 rounded-xl border border-white/10 bg-white/5 p-3 text-sm [@media(max-height:650px)]:hidden">
          Moc Restaurant
          <p className="mt-1 text-xs text-white/50">
            {area} · Kitchen Display System
          </p>
        </div>
      )}
      <nav
        aria-label="Kitchen navigation"
        className="mt-2 grid min-h-0 flex-1 auto-rows-fr gap-1"
      >
        {kitchenNavigation.map(([path, label, icon]) => (
          <NavLink
            end
            key={path}
            title={label}
            to={'/kitchen' + (path ? '/' + path : '')}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex min-h-0 items-center gap-3 rounded-lg px-3 text-sm ${isActive ? 'bg-[#0b694a] font-semibold' : 'text-white/70 hover:bg-white/10'}`
            }
          >
            <Icon name={icon} size={18} />
            <span className={collapsed ? 'sr-only' : ''}>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-2 shrink-0 border-t border-white/10 px-2 pt-2">
        {!collapsed && (
          <>
            <p className="text-sm font-semibold">Kitchen staff</p>
            <p className="mt-1 text-xs text-white/50">
              Kitchen workspace
            </p>
          </>
        )}
        <button
          title="Sign out"
          className="mt-2 flex min-h-9 items-center gap-2 text-sm text-emerald-200"
          onClick={onLogout}
        >
          <Icon name="arrow" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  )
}
