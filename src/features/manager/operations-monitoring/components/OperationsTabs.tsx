import { NavLink } from 'react-router-dom'

export function OperationsTabs() {
  return (
    <>
      <div
        role="status"
        className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
      >
        <strong>Preview · Sample data.</strong> This section demonstrates the
        interface only. It is not connected to live tables, kitchen tasks, or
        staff activity. No backend data is changed.
      </div>
      <nav
        aria-label="Operations monitoring"
        className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1"
      >
        {[
          ['table-monitoring', 'Table Status'],
          ['kitchen-monitoring', 'Kitchen Progress'],
          ['staff-activity', 'Staff Activity'],
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
