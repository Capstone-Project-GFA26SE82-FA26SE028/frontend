import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../../../components/Icon/Icon'
import { useAppSelector } from '../../../app/hooks'
import { kitchenNavigation } from '../navigation'

export function KitchenSidebar({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate: () => void
}) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const name = user?.fullName || user?.userName || 'Kitchen staff'

  return (
    <div className="flex h-full flex-col bg-linear-to-br from-[#00382b] via-[#00382d] to-[#002e28] text-white">
      <Link
        to="/kitchen/kds"
        onClick={onNavigate}
        aria-label="FoodHub Kitchen"
        className={`flex min-h-[76px] items-center gap-3 ${collapsed ? 'justify-center' : 'px-6'}`}
      >
        <span className="flex size-10 shrink-0 rotate-[-15deg] items-center justify-center rounded-[40%] border-2 border-lime-300/60 bg-linear-to-br from-lime-400 to-emerald-600 text-[#004c32]">
          <Icon name="leaf" size={29} />
        </span>
        {!collapsed && (
          <div>
            <span className="text-[23px] font-bold tracking-tight">
              FoodHub
            </span>
            <p className="text-xs text-white/65">Kitchen workspace</p>
          </div>
        )}
      </Link>
      <nav
        aria-label="Kitchen navigation"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
      >
        {!collapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
            Kitchen operations
          </p>
        )}
        {kitchenNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? 'KDS - Kitchen Display' : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex min-h-14 items-center gap-3 rounded-xl border px-3 text-sm transition-colors ${collapsed ? 'justify-center' : ''} ${isActive ? 'border-white/10 bg-white/15 text-lime-200 shadow-sm' : 'border-transparent text-white/75 hover:bg-white/10'}`
            }
          >
            <Icon name={item.icon} size={22} />
            {collapsed ? (
              <span className="sr-only">KDS - Kitchen Display</span>
            ) : (
              <>
                <div className="min-w-0">
                  <span className="block font-semibold">KDS</span>
                  <span className="mt-0.5 block text-[11px] text-white/55">
                    {item.description}
                  </span>
                </div>
                <Icon
                  name="chevron"
                  size={14}
                  className="ml-auto text-white/40"
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>
      {!collapsed && (
        <div className="mx-4 mb-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <Icon name="utensils" size={21} className="mb-2 text-lime-200" />
          <p className="text-xs font-medium text-white/85">
            From queue to service
          </p>
          <p className="mt-1 text-[11px] leading-5 text-white/45">
            Keep every dish moving with clear preparation updates.
          </p>
        </div>
      )}
      <div
        className={`flex min-h-[92px] items-center gap-3 border-t border-white/10 ${collapsed ? 'justify-center' : 'px-5'}`}
      >
        <span
          title={name}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-lg font-semibold text-emerald-100"
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="mt-1 text-xs text-emerald-100/60">Kitchen staff</p>
          </div>
        )}
      </div>
    </div>
  )
}
