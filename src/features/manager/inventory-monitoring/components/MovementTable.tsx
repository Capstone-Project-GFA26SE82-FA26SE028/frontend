import { Badge } from '../../../admin/components/AdminUI'
import { tableClass } from '../../menu-management/constants/styles'
import { dateLabel } from '../../menu-management/utils/price'
import type { Movement } from '../types/stock'

export function MovementTable({
  movements,
  unit,
}: {
  movements: Movement[]
  unit: string
}) {
  return (
    <div className="overflow-x-auto">
      <table className={tableClass}>
        <thead className="bg-slate-50">
          <tr>
            <th>Ghi nhận lúc (UTC+7)</th>
            <th>Loại</th>
            <th>Biến động số lượng</th>
            <th>Người thực hiện</th>
            <th>Lý do</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {movements.map((movement) => (
            <tr key={movement.stockMovementId}>
              <td className="whitespace-nowrap">
                {dateLabel(movement.createdAt)}
              </td>
              <td>
                <Badge tone={movement.quantityChange >= 0 ? 'green' : 'amber'}>
                  {movement.movementType}
                </Badge>
              </td>
              <td className="whitespace-nowrap font-semibold">
                {movement.quantityChange > 0 ? '+' : ''}
                {movement.quantityChange.toLocaleString('en-GB')} {unit}
              </td>
              <td className="max-w-48 break-all text-xs text-slate-500">
                {movement.performedByRef || 'Chưa ghi nhận'}
              </td>
              <td className="min-w-44 text-slate-500">
                {movement.reason || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
