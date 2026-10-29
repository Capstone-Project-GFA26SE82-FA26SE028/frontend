import type { ReactNode } from 'react'
import { formatCurrency } from '../../../../utils/currency'
export function CartSummary({
  total,
  count,
  tableCode,
  children,
}: {
  total: number | null
  count: number
  tableCode?: string
  children: ReactNode
}) {
  return (
    <aside className="panel h-fit p-6 lg:sticky lg:top-28">
      <h2 className="text-xl font-bold">Bữa ăn của bạn</h2>
      {tableCode && <p className="mt-2 text-sm text-muted">Bàn {tableCode}</p>}
      <div className="my-6 flex items-center justify-between gap-3 border-y border-dashed border-stone-200 py-5 text-sm">
        <span>
          Tạm tính ({count} {count === 1 ? 'món' : 'món'})
        </span>
        <strong className="shrink-0 font-semibold">
          {total === null ? 'Không khả dụng' : formatCurrency(total)}
        </strong>
      </div>
      <div className="mb-5 flex justify-between gap-3 text-lg font-bold">
        <span>Tổng tạm tính</span>
        <span className="text-brand">
          {total === null ? 'Không khả dụng' : formatCurrency(total)}
        </span>
      </div>
      {children}
      <p className="mt-4 text-xs leading-5 text-muted">
        Thuế, phí và giảm giá sẽ được xác nhận trên hóa đơn cuối cùng.
      </p>
    </aside>
  )
}
