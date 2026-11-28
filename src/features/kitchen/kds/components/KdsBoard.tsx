import { kdsColumns } from '../constants'
import { KdsColumn } from './KdsColumn'
import type { KdsBoardProps } from '../types'

export function KdsBoard({ shown, activeColumn = 'all', ...props }: KdsBoardProps) {
  const displayedColumns =
    activeColumn === 'all'
      ? kdsColumns
      : kdsColumns.filter((c) => c.status === activeColumn)

  return (
    <div className="h-full min-h-0 overflow-x-auto overflow-y-hidden pb-1">
      <div
        className={`grid h-full min-h-0 items-stretch gap-3.5 transition-all duration-200 ${
          activeColumn === 'all'
            ? 'min-w-[1140px] grid-cols-4'
            : 'mx-auto w-full max-w-3xl grid-cols-1'
        }`}
      >
        {displayedColumns.map((column) => (
          <KdsColumn
            key={column.status}
            column={column}
            items={shown.filter((order) => order.status === column.status)}
            {...props}
          />
        ))}
      </div>
    </div>
  )
}
