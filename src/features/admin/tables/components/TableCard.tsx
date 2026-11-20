import { useQuery } from '@tanstack/react-query'
import { getCurrentQr } from '../api/tableQrApi'
import { Icon } from '../../../../components/Icon/Icon'
import type { Table, TableMode } from '../types/types'
import { useAppSelector } from '../../../../app/hooks'
export function TableCard({
  table,
  areaName,
  onAction,
}: {
  table: Table
  areaName: string
  onAction: (mode: TableMode, id: string) => void
}) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const qr = useQuery({
    queryKey: [
      'table-qr',
      user?.restaurantId,
      user?.userId,
      'status',
      table.tableId,
      table.tableCode,
    ],
    queryFn: ({ signal }) =>
      getCurrentQr(
        table.tableId,
        table.tableCode,
        signal,
        user?.restaurantId || undefined,
      ),
    enabled: !!user?.restaurantId,
    retry: false,
  })
  const qrLabel = qr.isError
    ? 'Chưa có thông tin QR'
    : qr.isPending
      ? 'Đang kiểm tra QR…'
      : qr.data
        ? 'Đã có QR'
        : 'Chưa có QR'
  const status = table.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'
  const headerColor = table.isActive
    ? 'from-brand-dark to-brand'
    : 'from-rose-900 to-rose-700'
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className={
          'flex items-start justify-between gap-3 bg-gradient-to-br p-4 text-white ' +
          headerColor
        }
      >
        <button
          onClick={() => onAction('view', table.tableId)}
          aria-label={'View details ' + table.tableCode}
          className="min-w-0 flex-1 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <div className="min-w-0">
            <h3
              className="truncate text-2xl font-bold tracking-tight"
              title={table.tableCode}
            >
              {table.tableCode}
            </h3>
          </div>
          <span className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-inset ring-white/15">
            {status}
          </span>
        </button>
        <div className="flex shrink-0 flex-col items-end gap-3">
          <button
            type="button"
            onClick={() => onAction('qr', table.tableId)}
            title={qrLabel}
            aria-label={qrLabel + ' - ' + table.tableCode}
            className={
              'relative flex size-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 ' +
              (qr.isError
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                : qr.isSuccess && qr.data
                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100')
            }
          >
            <Icon name="qr" size={19} />
            {qr.isSuccess && qr.data && (
              <span className="absolute right-1 top-1 size-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <Icon name="pin" size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400">Khu vực</p>
            <p
              className="mt-0.5 truncate text-sm font-semibold text-slate-700"
              title={areaName}
            >
              {areaName}
            </p>
          </div>
        </div>
        <div className="shrink-0 border-l border-slate-100 pl-3 text-right">
          <p className="text-[11px] text-slate-400">Số chỗ</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-700">
            {table.capacity}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1 border-t border-slate-100 bg-slate-50/60 p-2">
        {(['edit', 'move', 'status', 'delete'] as const).map((mode) => {
          const label =
            mode === 'edit'
              ? 'Sửa'
              : mode === 'move'
                ? 'Chuyển khu vực'
                : mode === 'delete'
                  ? 'Xóa'
                  : table.isActive
                    ? 'Ngừng hoạt động'
                    : 'Kích hoạt'
          return (
            <button
              key={mode}
              title={label}
              aria-label={label + ' ' + table.tableCode}
              onClick={() => onAction(mode, table.tableId)}
              className={
                'flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg transition-colors ' +
                (mode === 'delete'
                  ? 'text-rose-400 hover:bg-rose-50'
                  : mode === 'status'
                    ? table.isActive
                      ? 'text-amber-700 hover:bg-amber-50'
                      : 'text-emerald-700 hover:bg-emerald-50'
                    : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-700')
              }
            >
              <Icon
                name={
                  mode === 'edit'
                    ? 'edit'
                    : mode === 'move'
                      ? 'arrow'
                      : mode === 'delete'
                        ? 'trash'
                        : table.isActive
                          ? 'ban'
                          : 'power'
                }
                size={18}
              />
              <span className="text-[10px] font-medium">
                {mode === 'edit'
                  ? 'Sửa'
                  : mode === 'move'
                    ? 'Chuyển'
                    : mode === 'delete'
                      ? 'Xóa'
                      : table.isActive
                        ? 'Ngừng'
                        : 'Bật lại'}
              </span>
            </button>
          )
        })}
      </div>
    </article>
  )
}
