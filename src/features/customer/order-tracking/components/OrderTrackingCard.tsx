import { formatCurrency } from '../../../../utils/currency'
import type { PreviewOrder } from '../types'

type OrderTrackingCardProps = {
  order: PreviewOrder
  orderNumber: number
}

export function OrderTrackingCard({
  order,
  orderNumber,
}: OrderTrackingCardProps) {
  return (
    <article className="panel p-6">
      <div className="flex flex-wrap justify-between gap-3">
        <h2 className="text-lg font-bold">Lượt gọi món {orderNumber}</h2>
        <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-brand">
          {order.paymentRequested
            ? 'Chờ xác nhận thanh toán'
            : 'Chờ xác nhận món'}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted">
        {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })}{' '}
        · Bàn 08
      </p>
      <ol className="my-6 grid grid-cols-4 gap-2">
        {['Chờ xác nhận', 'Đang nấu', 'Món đã xong', 'Đã phục vụ'].map(
          (label, i) => (
            <li
              key={label}
              className={`text-center text-xs ${i === 0 ? 'font-semibold text-brand' : 'text-muted'}`}
            >
              <div
                className={`mb-2 h-1.5 rounded-full ${i === 0 ? 'bg-brand' : 'bg-stone-100'}`}
              />
              {label}
            </li>
          ),
        )}
      </ol>
      {order.items.map((i) => (
        <div
          key={i.id}
          className="flex items-center gap-3 border-t border-stone-100 py-3"
        >
          <img
            src={i.image}
            alt={i.name}
            className="size-14 rounded-xl object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {i.quantity} × {i.name}
            </p>
            <p className="mt-1 text-xs text-muted">{i.option}</p>
          </div>
          <span className="text-sm font-semibold">
            {formatCurrency(i.unitPrice * i.quantity)}
          </span>
        </div>
      ))}
      <p className="mt-3 text-xs leading-5 text-muted">
        Vui lòng xác nhận lượt gọi món với nhân viên. Bạn có thể gọi thêm món bất cứ lúc nào.
      </p>
    </article>
  )
}
