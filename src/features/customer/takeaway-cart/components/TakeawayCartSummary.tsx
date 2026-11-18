import type { TakeawayCart } from '../types/types'
export function TakeawayCartSummary({ cart }: { cart: TakeawayCart }) {
  return (
    <aside className="panel h-fit p-6 lg:sticky lg:top-28">
      <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>
      <p className="mt-2 text-sm text-muted">Mang đi · Nhận món tại nhà hàng</p>
      <div className="my-6 flex items-center justify-between gap-3 border-y border-dashed border-stone-200 py-5 text-sm">
        <span>
          Tạm tính ({cart.items.reduce((sum, line) => sum + line.quantity, 0)}{' '}
          món)
        </span>
        <strong>
          {cart.quote?.isValid && cart.quote.totalAmount !== null
            ? cart.quote.totalAmount.toLocaleString('vi-VN') + ' đ'
            : 'Chưa xác nhận'}
        </strong>
      </div>
      <div className="mb-5 flex flex-wrap justify-between gap-3 text-lg font-bold">
        <span>Tổng tạm tính</span>
        <span className="text-brand">
          {cart.quote?.isValid && cart.quote.totalAmount !== null
            ? cart.quote.totalAmount.toLocaleString('vi-VN') + ' đ'
            : 'Chưa xác nhận'}
        </span>
      </div>
      {cart.quote && !cart.quote.isValid && (
        <p role="alert" className="text-sm text-amber-800">
          {cart.quote.message || 'Một số món cần được kiểm tra lại.'}
        </p>
      )}
      <p className="mt-4 text-xs leading-5 text-muted">
        Thuế, phí và giảm giá sẽ được xác nhận trên hóa đơn cuối cùng.
      </p>
    </aside>
  )
}
