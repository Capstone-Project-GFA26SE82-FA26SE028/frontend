import { kdsColumns } from '../constants'
import { KdsColumn } from './KdsColumn'
import type { KdsBoardProps } from '../types'

export function KdsBoard({ shown, ...props }: KdsBoardProps) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="grid min-w-[1120px] grid-cols-4 items-stretch gap-[17px]">
        {kdsColumns.map((column) => (
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
