import { useQuery } from '@tanstack/react-query'
import { getCurrentQr } from '../api/tableQrApi'
import { Icon } from '../../../../components/Icon/Icon'
import type { Table, TableMode } from '../types'
export function TableCard({
  table,
  areaName,
  onAction,
}: {
  table: Table
  areaName: string
  onAction: (mode: TableMode, id: string) => void
}) {
  const qr = useQuery({
    queryKey: ['table-qr', 'status', table.tableId, table.tableCode],
    queryFn: ({ signal }) =>
      getCurrentQr(table.tableId, table.tableCode, signal),
  })
  const qrLabel = qr.isError
    ? 'QR unavailable'
    : qr.isPending
      ? 'Checking QR...'
      : qr.data
        ? 'Has QR'
        : 'No QR'
  const status = table.isActive ? 'Active' : 'Inactive'
  const tone = table.isActive
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-slate-200 bg-slate-50 text-slate-500'
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <button
        onClick={() => onAction('view', table.tableId)}
        aria-label={'View details ' + table.tableCode}
        className="block w-full rounded-t-2xl p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:p-5"
      >
        <div className="flex items-center justify-between gap-2 pr-10">
          <span className="truncate text-xs font-semibold tracking-wider text-slate-400">
            {table.tableCode}
          </span>
          <span className="text-xs text-slate-500">{table.capacity} seats</span>
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
          <span
            className="max-w-full truncate px-1 text-xl font-bold"
            title={table.tableCode}
          >
            {table.tableCode}
          </span>
        </div>
        <h3
          className="truncate text-center text-base font-semibold text-slate-800"
          title={areaName}
        >
          {areaName}
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
      <button
        type="button"
        onClick={() => onAction('qr', table.tableId)}
        title={qrLabel}
        aria-label={qrLabel + ' - ' + table.tableCode}
        className={
          'absolute right-2 top-2 flex size-9 items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 sm:right-3 sm:top-3 ' +
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
      <div className="flex justify-around border-t border-slate-100 px-2 py-1">
        {(['edit', 'move', 'status', 'delete'] as const).map((mode) => {
          const label =
            mode === 'edit'
              ? 'Edit'
              : mode === 'move'
                ? 'Move area'
                : mode === 'delete'
                  ? 'Delete'
                  : table.isActive
                    ? 'Deactivate'
                    : 'Activate'
          return (
            <button
              key={mode}
              title={label}
              aria-label={label + ' ' + table.tableCode}
              onClick={() => onAction(mode, table.tableId)}
              className={
                'flex size-10 items-center justify-center rounded-lg ' +
                (mode === 'delete'
                  ? 'text-rose-400 hover:bg-rose-50'
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
                          : 'check'
                }
                size={18}
              />
            </button>
          )
        })}
      </div>
    </article>
  )
}
