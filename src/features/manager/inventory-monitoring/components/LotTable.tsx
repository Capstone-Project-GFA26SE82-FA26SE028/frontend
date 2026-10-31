import { Badge } from '../../../../components/Badge/Badge'
import { tableClass } from '../../menu-management/constants/styles'
import { dateLabel } from '../../menu-management/utils/price'
import type { StockLot } from '../types/stock'

export function LotTable({ lots, unit }: { lots: StockLot[]; unit: string }) {
  const labels: Record<string, string> = {
    Valid: 'Còn hạn',
    ExpiringSoon: 'Sắp hết hạn',
    Expired: 'Đã hết hạn',
    Unknown: 'Chưa xác định',
  }
  return (
    <div className="overflow-x-auto">
      <table className={tableClass}>
        <thead className="bg-slate-50">
          <tr>
            <th>Lô nhập</th>
            <th>Ngày nhập (UTC+7)</th>
            <th>Hạn sử dụng</th>
            <th>Số lượng nhập</th>
            <th>Số lượng còn lại</th>
            <th>Tình trạng hạn dùng</th>
            <th>Có thể xuất</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {lots.map((lot) => (
            <tr key={lot.goodsReceiptItemId}>
              <td className="max-w-44 break-all text-xs text-slate-500">
                {lot.goodsReceiptItemId}
              </td>
              <td className="whitespace-nowrap">{dateLabel(lot.receivedAt)}</td>
              <td>{lot.expiryDate || 'Chưa ghi nhận'}</td>
              <td>
                {lot.receivedQuantity.toLocaleString('en-GB')} {unit}
              </td>
              <td>
                {lot.remainingQuantity.toLocaleString('en-GB')} {unit}
              </td>
              <td>
                <Badge
                  tone={
                    lot.expiryStatus === 'Expired'
                      ? 'red'
                      : lot.expiryStatus === 'ExpiringSoon'
                        ? 'amber'
                        : lot.expiryStatus === 'Valid'
                          ? 'green'
                          : 'slate'
                  }
                >
                  {labels[lot.expiryStatus] || lot.expiryStatus}
                </Badge>
              </td>
              <td>{lot.canIssue ? 'Có' : 'Không'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
