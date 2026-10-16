import { SearchField, fieldClass } from '../../components/AdminUI'
import { roles, roleLabels, type AdminUser, type Role } from '../../users/types'
export function RoleUserFilters({
  query,
  role,
  status,
  matchingUsers,
  onQuery,
  onRole,
  onStatus,
}: {
  query: string
  role: Role | 'all'
  status: string
  matchingUsers: AdminUser[]
  onQuery: (value: string) => void
  onRole: (value: Role | 'all') => void
  onStatus: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
      <div
        role="group"
        aria-label="Lọc trạng thái tài khoản"
        className="flex shrink-0 gap-2 overflow-x-auto py-1 sm:gap-3"
      >
        {[
          {
            value: 'all',
            label: 'Tất cả',
            count: matchingUsers.length,
            dot: '',
          },
          {
            value: 'active',
            label: 'Hoạt động',
            count: matchingUsers.filter((u) => u.active).length,
            dot: 'bg-emerald-500',
          },
          {
            value: 'locked',
            label: 'Đã khóa',
            count: matchingUsers.filter((u) => !u.active).length,
            dot: 'bg-rose-500',
          },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={status === item.value}
            onClick={() => {
              onStatus(item.value)
            }}
            className={
              'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ' +
              (status === item.value
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50')
            }
          >
            {item.dot && (
              <span
                aria-hidden="true"
                className={
                  'size-2.5 rounded-full ' +
                  (status === item.value ? 'bg-white' : item.dot)
                }
              />
            )}
            {item.label}
            <span
              className={
                status === item.value ? 'text-white/75' : 'text-slate-500'
              }
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row xl:ml-auto xl:w-[440px]">
        <SearchField
          value={query}
          onChange={(v) => {
            onQuery(v)
          }}
          placeholder="Tìm tên, email, nhà hàng…"
        />
        <select
          aria-label="Lọc vai trò"
          value={role}
          onChange={(e) => {
            onRole(e.target.value as Role | 'all')
          }}
          className={`${fieldClass} sm:w-48`}
        >
          <option value="all">Tất cả vai trò</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
