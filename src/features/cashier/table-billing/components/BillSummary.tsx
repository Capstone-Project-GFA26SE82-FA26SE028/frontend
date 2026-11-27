import type { CashierBill } from '../types/types'

export function BillSummary({
  bill,
  paid,
}: {
  bill: CashierBill
  paid: boolean
}) {
  const money = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: bill.currency || 'VND',
  })
  const cashierWarnings = bill.warnings.filter(
    (warning) => warning !== 'Dữ liệu giá vốn nguyên liệu không khả dụng. Không thể tính toán giá vốn và lợi nhuận đầy đủ.',
  )
  return (
    <>
      <div className="flex-1 overflow-x-auto px-5">
        <table data-receipt className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="py-3">
                Tên món
              </th>
              <th scope="col" className="px-2 text-center">
                SL
              </th>
              <th scope="col" className="text-right">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bill.items.map((line) => (
              <tr key={line.billLineId}>
                <td className="py-4">
                  <p className="font-medium">{line.item.name}</p>
                  <p data-receipt-hide className="mt-1 text-xs text-slate-500">
                    {money.format(line.unitPriceSnapshot)}
                  </p>
                </td>
                <td className="px-2 text-center tabular-nums">
                  {line.quantity}
                </td>
                <td className="whitespace-nowrap text-right font-medium tabular-nums">
                  {money.format(line.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!!cashierWarnings.length && (
          <ul className="my-3 space-y-1 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            {cashierWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        )}
      </div>
      <dl data-receipt className="space-y-1.5 border-t border-slate-200 bg-slate-50 p-5 text-xs text-slate-600 [&_dd]:tabular-nums [&_dt]:text-slate-500">
        <div className="flex justify-between gap-3">
          <dt>Tạm tính</dt>
          <dd>{money.format(bill.subTotal)}</dd>
        </div>
        {bill.discountAmount !== 0 && (
          <div className="flex justify-between gap-3">
            <dt>Giảm giá</dt>
            <dd>{money.format(-bill.discountAmount)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <dt>VAT</dt>
          <dd>{money.format(bill.vatAmount)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Phí dịch vụ</dt>
          <dd>{money.format(bill.serviceAmount)}</dd>
        </div>
        {bill.roundingAdjustment !== 0 && (
          <div className="flex justify-between gap-3">
            <dt>Làm tròn</dt>
            <dd>{money.format(bill.roundingAdjustment)}</dd>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <dt className="text-sm font-semibold text-slate-700!">
            {paid ? 'Đã thu' : 'Khách cần trả'}
          </dt>
          <dd className="text-2xl font-bold tracking-tight text-emerald-800">
            {money.format(bill.totalAmount)}
          </dd>
        </div>
      </dl>
    </>
  )
}
