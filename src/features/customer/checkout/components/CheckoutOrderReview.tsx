import { Link } from 'react-router-dom'
import { formatCurrency } from '../../../../utils/currency'
import type { CartItem } from '../../cart/types'

type CheckoutOrderReviewProps = {
  items: CartItem[]
}

export function CheckoutOrderReview({ items }: CheckoutOrderReviewProps) {
  return (
    <div className="panel p-6">
      <div className="mb-5 rounded-2xl bg-mint p-4 text-sm text-brand">
        <strong>Bàn 08 · Không gian vườn</strong>
        <p className="mt-1">Kiểm tra món và ghi chú trước khi xác nhận.</p>
      </div>
      {items.map((i) => (
        <div
          key={i.id}
          className="flex justify-between gap-4 border-b border-stone-100 py-4"
        >
          <div>
            <p className="font-semibold">
              {i.quantity} × {i.name}
            </p>
            <p className="mt-1 text-xs text-muted">
              {i.option}
              {i.note && ` · ${i.note}`}
            </p>
          </div>
          <span className="shrink-0 text-sm">
            {formatCurrency(i.unitPrice * i.quantity)}
          </span>
        </div>
      ))}
      <Link to="/cart" className="btn-secondary mt-6">
        Chỉnh sửa giỏ hàng
      </Link>
    </div>
  )
}
