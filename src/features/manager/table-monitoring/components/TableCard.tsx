import { Icon } from '../../../../components/Icon/Icon'
import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getCurrentQr } from '../api/tableQrApi'
import type { Table } from '../types/table'
export function TableCard({
  table,
  areaName,
  onView,
  onQr,
}: {
  table: Table
  areaName: string
  onView: () => void
  onQr: () => void
}) {
  const user = useAppSelector((state) => state.auth.session?.user)
  const qr = useQuery({
    queryKey: [
      'manager-table-qr',
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
    enabled: user?.roleId === 'manager' && !!user.restaurantId,
    retry: false,
  })
  const qrLabel = qr.isError
    ? 'Chưa có thông tin QR'
    : qr.isPending
      ? 'Đang kiểm tra QR…'
      : qr.data
        ? 'Đã có QR'
        : 'Chưa có QR'
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className={
          'flex items-start justify-between gap-3 bg-gradient-to-br p-4 text-white ' +
          (table.isActive
            ? 'from-brand-dark to-brand'
            : 'from-rose-900 to-rose-700')
        }
      >
        <button
          onClick={onView}
          aria-label={'Xem chi tiết ' + table.tableCode}
          className="min-w-0 flex-1 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <h3
            className="truncate text-2xl font-bold tracking-tight"
            title={table.tableCode}
          >
            {table.tableCode}
          </h3>
          <span className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-inset ring-white/15">
            {table.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </span>
        </button>
        <button
          type="button"
          onClick={onQr}
          title={qrLabel}
          aria-label={`${qrLabel} - ${table.tableCode}`}
          className={
            'relative flex size-9 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-white ' +
            (qr.isError
              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              : qr.data
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100')
          }
        >
          <Icon name="qr" size={19} />
          {qr.data && (
            <span className="absolute right-1 top-1 size-1.5 rounded-full bg-emerald-500" />
          )}
        </button>
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
      <div className="grid grid-cols-2 gap-1 border-t border-slate-100 bg-slate-50/60 p-2">
        <button
          onClick={onView}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          <Icon name="eye" size={18} />
          Xem chi tiết
        </button>
        <button
          onClick={onQr}
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          <Icon name="qr" size={18} />
          Xem / Tạo QR
        </button>
      </div>
    </article>
  )
}
