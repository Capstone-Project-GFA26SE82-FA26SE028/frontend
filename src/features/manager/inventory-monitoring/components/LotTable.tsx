import { Badge } from '../../../admin/components/AdminUI'
import { tableClass } from '../../menu-management/constants/styles'
import { dateLabel } from '../../menu-management/utils/price'
import type { StockLot } from '../types/stock'

export function LotTable({ lots, unit }: { lots: StockLot[]; unit: string }) {
  const labels: Record<string, string> = {
    Valid: 'Valid',
    ExpiringSoon: 'Expiring soon',
    Expired: 'Expired',
    Unknown: 'Unknown',
  }
  return (
    <div className="overflow-x-auto">
      <table className={tableClass}>
        <thead className="bg-slate-50">
          <tr>
            <th>Receipt lot</th>
            <th>Received (UTC+7)</th>
            <th>Expiry date</th>
            <th>Received quantity</th>
            <th>Remaining quantity</th>
            <th>Expiry status</th>
            <th>Can issue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {lots.map((lot) => (
            <tr key={lot.goodsReceiptItemId}>
              <td className="max-w-44 break-all text-xs text-slate-500">
                {lot.goodsReceiptItemId}
              </td>
              <td className="whitespace-nowrap">{dateLabel(lot.receivedAt)}</td>
              <td>{lot.expiryDate || 'Not recorded'}</td>
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
              <td>{lot.canIssue ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
