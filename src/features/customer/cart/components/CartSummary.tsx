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
      <h2 className="text-xl font-bold">Your meal</h2>
      {tableCode && (
        <p className="mt-2 text-sm text-muted">Table {tableCode}</p>
      )}
      <div className="my-6 flex items-center justify-between gap-3 border-y border-dashed border-stone-200 py-5 text-sm">
        <span>
          Subtotal ({count} {count === 1 ? 'item' : 'items'})
        </span>
        <strong className="shrink-0 font-semibold">
          {total === null ? 'Unavailable' : formatCurrency(total)}
        </strong>
      </div>
      <div className="mb-5 flex justify-between gap-3 text-lg font-bold">
        <span>Estimated total</span>
        <span className="text-brand">
          {total === null ? 'Unavailable' : formatCurrency(total)}
        </span>
      </div>
      {children}
      <p className="mt-4 text-xs leading-5 text-muted">
        Taxes, fees and discounts are confirmed on your final bill.
      </p>
    </aside>
  )
}
