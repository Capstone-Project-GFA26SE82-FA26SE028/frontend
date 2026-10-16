import type { RestaurantTable } from '../schema'
export function TableCard({
  table,
  onEdit,
  onDelete,
}: {
  table: RestaurantTable
  onEdit: () => void
  onDelete: () => void
}) {
  const status = !table.active
    ? 'Ngừng sử dụng'
    : !table.areaId
      ? 'Chưa phân khu vực'
      : table.busy
        ? 'Đang phục vụ'
        : 'Bàn trống'
  const tone =
    !table.active || !table.areaId
      ? 'border-slate-200 bg-slate-50 text-slate-500'
      : table.busy
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <button
        onClick={onEdit}
        aria-label={'Chỉnh sửa ' + table.name}
        className="block w-full rounded-t-2xl p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:p-5"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold tracking-wider text-slate-400">
            {table.code}
          </span>
          <span className="text-xs text-slate-500">{table.capacity} chỗ</span>
        </div>
        <div
          className={
            'relative mx-auto my-7 flex h-20 w-20 items-center justify-center rounded-2xl border-2 ' +
            tone
          }
          aria-hidden="true"
        >
          {Array.from({ length: Math.min(table.capacity, 8) }, (_, i) => {
            const side = i % 4
            const second = i >= 4
            return (
              <span
                key={i}
                className={
                  'absolute rounded-md border-2 bg-white ' + tone.split(' ')[0]
                }
                style={
                  side === 0
                    ? {
                        top: -10,
                        left: second ? '60%' : '15%',
                        width: 19,
                        height: 9,
                      }
                    : side === 1
                      ? {
                          right: -10,
                          top: second ? '60%' : '15%',
                          height: 19,
                          width: 9,
                        }
                      : side === 2
                        ? {
                            bottom: -10,
                            left: second ? '15%' : '60%',
                            width: 19,
                            height: 9,
                          }
                        : {
                            left: -10,
                            top: second ? '15%' : '60%',
                            height: 19,
                            width: 9,
                          }
                }
              />
            )
          })}
          <span className="text-xl font-bold">{table.code}</span>
        </div>
        <h3
          className="truncate text-center text-base font-semibold text-slate-800"
          title={table.name}
        >
          {table.name}
        </h3>
        <p
          className={
            'mt-3 flex min-h-8 items-center justify-center gap-1.5 rounded-lg px-1 py-1 text-center text-xs font-medium ' +
            tone
          }
        >
          <span className="size-1.5 shrink-0 rounded-full bg-current" />
          {status}
        </p>
      </button>
      <div className="flex items-center justify-between border-t border-slate-100 px-3 sm:px-5">
        <button
          onClick={onEdit}
          className="min-h-11 text-xs font-medium text-slate-500 hover:text-emerald-700"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={onDelete}
          aria-label={'Xóa ' + table.name}
          className="min-h-11 px-2 text-xs text-slate-400 hover:text-rose-600"
        >
          Xóa
        </button>
      </div>
    </article>
  )
}
