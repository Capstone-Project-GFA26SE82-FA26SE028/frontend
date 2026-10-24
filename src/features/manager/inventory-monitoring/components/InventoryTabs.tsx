import { NavLink } from 'react-router-dom'

export function InventoryTabs() {
  return (
    <nav
      aria-label="Inventory monitoring"
      className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1"
    >
      {[
        ['stock', 'Stock overview'],
        ['stock-history', 'Movements & Lots'],
        ['stock-variance', 'Usage & Variance'],
      ].map(([path, label]) => (
        <NavLink
          key={path}
          to={`/manager/${path}`}
          className={({ isActive }) =>
            `min-h-11 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-50'}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
