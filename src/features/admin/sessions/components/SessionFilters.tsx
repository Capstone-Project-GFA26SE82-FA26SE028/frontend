import { SearchField, fieldClass } from '../../components/AdminUI'
import { roleLabels, type Role } from '../../users/types'
export function SessionFilters({
  search,
  status,
  role,
  date,
  roles,
  total,
  active,
  onSearch,
  onStatus,
  onRole,
  onDate,
}: {
  search: string
  status: string
  role: string
  date: string
  roles: Role[]
  total: number
  active: number
  onSearch: (v: string) => void
  onStatus: (v: string) => void
  onRole: (v: string) => void
  onDate: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
      <div
        role="group"
        aria-label="Lọc trạng thái phiên"
        className="flex shrink-0 gap-2 overflow-x-auto py-1"
      >
        {[
          { value: '', label: 'Tất cả', count: total, dot: '' },
          {
            value: 'true',
            label: 'Hoạt động',
            count: active,
            dot: 'bg-emerald-500',
          },
          {
            value: 'false',
            label: 'Đã kết thúc',
            count: total - active,
            dot: 'bg-slate-400',
          },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={status === item.value}
            onClick={() => onStatus(item.value)}
            className={
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ' +
              (status === item.value
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:bg-emerald-50')
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
            )}{' '}
            {item.label}
            <span
              className={
                status === item.value ? 'text-white/75' : 'text-slate-400'
              }
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row xl:ml-auto xl:flex-1 xl:max-w-[640px]">
        <SearchField
          value={search}
          onChange={onSearch}
          placeholder="Tài khoản, IP, thiết bị…"
        />
        <select
          aria-label="Vai trò"
          value={role}
          onChange={(e) => onRole(e.target.value)}
          className={fieldClass + ' sm:w-40 sm:shrink-0'}
        >
          <option value="">Mọi vai trò</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </select>
        <input
          aria-label="Ngày đăng nhập"
          type="date"
          value={date}
          onChange={(e) => onDate(e.target.value)}
          className={fieldClass + ' sm:w-40 sm:shrink-0'}
        />
      </div>
    </div>
  )
}
