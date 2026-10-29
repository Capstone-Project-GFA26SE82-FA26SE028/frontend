import { Link } from 'react-router-dom'
import { formatCurrency } from '../../../../utils/currency'
import type { CustomerCart } from '../../cart/types/types'
import { quotedItem, quotedUnitPrice } from '../../cart/cartHelpers'
export function CheckoutOrderReview({
  cart,
  tableCode,
}: {
  cart: CustomerCart
  tableCode?: string
}) {
  return (
    <div className="panel p-6">
      <div className="mb-5 rounded-2xl bg-mint p-4 text-sm text-brand">
        <strong>{tableCode ? 'Bàn ' + tableCode : 'Bàn của bạn'}</strong>
        <p className="mt-1">Kiểm tra món, tùy chọn và ghi chú cho bếp.</p>
      </div>
      {cart.items.map((line, index) => {
        const quote = quotedItem(cart, line)
        return (
          <div
            key={index}
            className="flex justify-between gap-4 border-b border-stone-100 py-4"
          >
            <div>
              <p className="font-semibold">
                {line.quantity} x {quote?.name || 'Món không còn phục vụ'}
              </p>
              {quote?.options.map((o) => (
                <p key={o.optionId} className="mt-1 text-xs text-muted">
                  {o.name}
                  {o.quantity > 1 ? ' x ' + o.quantity : ''}
                </p>
              ))}
              {line.note && (
                <p className="mt-1 text-xs text-muted">{line.note}</p>
              )}
            </div>
            <span className="shrink-0 text-sm">
              {quote
                ? formatCurrency(quotedUnitPrice(quote) * line.quantity)
                : 'Không khả dụng'}
            </span>
          </div>
        )
      })}
      <Link to="/cart" className="btn-secondary mt-6">
        Sửa giỏ hàng
      </Link>
    </div>
  )
}
