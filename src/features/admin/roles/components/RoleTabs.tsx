export type RoleTab = 'roles' | 'assignments'
export function RoleTabs({
  tab,
  onChange,
}: {
  tab: RoleTab
  onChange: (tab: RoleTab) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Vai trò và phân quyền"
      className="mb-5 flex gap-1 border-b border-slate-200"
    >
      {(['roles', 'assignments'] as const).map((value) => (
        <button
          key={value}
          id={'tab-' + value}
          role="tab"
          aria-selected={tab === value}
          aria-controls={'panel-' + value}
          tabIndex={tab === value ? 0 : -1}
          onClick={() => {
            onChange(value)
          }}
          onKeyDown={(e) => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
              e.preventDefault()
              const next =
                e.key === 'Home'
                  ? 'roles'
                  : e.key === 'End'
                    ? 'assignments'
                    : value === 'roles'
                      ? 'assignments'
                      : 'roles'
              onChange(next)

              document.getElementById('tab-' + next)?.focus()
            }
          }}
          className={
            'min-h-12 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ' +
            (tab === value
              ? 'border-emerald-700 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-emerald-700')
          }
        >
          {value === 'roles' ? 'Danh sách vai trò' : 'Phân quyền'}
        </button>
      ))}
    </div>
  )
}
