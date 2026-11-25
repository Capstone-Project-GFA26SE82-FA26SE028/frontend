import { NavLink } from 'react-router-dom'
export function StationTabs() {
  return (
    <nav aria-label="Thiết lập bếp" className="mb-5 flex gap-3">
      {[
        ['/manager/kitchen-stations', 'Trạm bếp'],
        ['/manager/kitchen-stations/items', 'Phân món cho trạm'],
      ].map(([to, label]) => (
        <NavLink
          end
          key={to}
          to={to}
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600'}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
