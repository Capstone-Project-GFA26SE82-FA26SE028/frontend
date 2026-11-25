import { NavLink } from 'react-router-dom'

export function OperationsTabs() {
  return (
    <>
      <nav
        aria-label="Theo dõi vận hành"
        className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1"
      >
        {[
          ['table-monitoring', 'Trạng thái bàn'],
          ['kitchen-monitoring', 'Tiến độ bếp'],
          ['staff-activity', 'Hoạt động nhân viên'],
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
    </>
  )
}
