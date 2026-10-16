import { SearchField } from '../../components/AdminUI'
export function AreaFilters({
  search,
  status,
  total,
  active,
  onSearch,
  onStatus,
}: {
  search: string
  status: string
  total: number
  active: number
  onSearch: (value: string) => void
  onStatus: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
      <div
        role="group"
        aria-label="Lọc trạng thái khu vực"
        className="flex shrink-0 gap-2 overflow-x-auto py-1 sm:gap-3"
      >
        {[
          { value: '', label: 'Tất cả', count: total, dot: '' },
          {
            value: 'true',
            label: 'Đang sử dụng',
            count: active,
            dot: 'bg-emerald-500',
          },
          {
            value: 'false',
            label: 'Ngừng sử dụng',
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
              'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ' +
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
      <div className="min-w-0 xl:ml-auto xl:w-80">
        <SearchField
          value={search}
          onChange={onSearch}
          placeholder="Tìm theo mã hoặc tên…"
        />
      </div>
    </div>
  )
}
