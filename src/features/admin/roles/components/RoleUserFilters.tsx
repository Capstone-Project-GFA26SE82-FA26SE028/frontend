import { SearchField, fieldClass } from '../../components/AdminUI'
import type { SystemRole } from '../types/types'
export function RoleUserFilters({
  query,
  role,
  status,
  roles,
  onQuery,
  onRole,
  onStatus,
}: {
  query: string
  role: string
  status: string
  roles: SystemRole[]
  onQuery: (value: string) => void
  onRole: (value: string) => void
  onStatus: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
      <div
        role="group"
        aria-label="Lọc trạng thái tài khoản"
        className="flex min-w-0 gap-2 overflow-x-auto py-1 sm:gap-3"
      >
        {[
          { value: 'all', label: 'Tất cả', dot: '' },
          { value: 'active', label: 'Đang hoạt động', dot: 'bg-emerald-500' },
          { value: 'inactive', label: 'Đã vô hiệu hóa', dot: 'bg-rose-500' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={status === item.value}
            onClick={() => onStatus(item.value)}
            className={
              'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ' +
              (status === item.value
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-emerald-50')
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
          </button>
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row xl:ml-auto xl:w-[500px]">
        <SearchField
          value={query}
          onChange={onQuery}
          placeholder="Tìm tên, email, tên đăng nhập…"
        />
        <select
          aria-label="Lọc theo vai trò"
          value={role}
          onChange={(event) => onRole(event.target.value)}
          className={`${fieldClass} sm:w-48`}
        >
          <option value="all">Tất cả vai trò</option>
          {roles.map((item) => (
            <option key={item.roleId} value={item.roleId}>
              {item.roleName}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
