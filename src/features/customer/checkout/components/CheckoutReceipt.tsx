import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { formatCurrency } from '../../../../utils/currency'
import { getSubmittedOrder } from '../api/checkoutApi'
import { OrderStatusBadge } from '../../order-tracking/components/OrderStatusBadge'
import { orderTrackingError } from '../../order-tracking/api/orderTrackingApi'

export function CheckoutReceipt({ orderId }: { orderId: string }) {
  const table = useAppSelector((s) => s.customerSession.table)
  const order = useQuery({
    queryKey: ['customer-checkout-order', table?.tableSessionId, orderId],
    queryFn: ({ signal }) =>
      getSubmittedOrder(table!.tableSessionId, orderId, signal),
    enabled: !!table,
    retry: false,
    refetchInterval: 15000,
  })
  return (
    <section className="mx-auto max-w-2xl py-8">
      <div className="panel p-6 sm:p-8">
        <p className="eyebrow">
          {table ? 'Bàn ' + table.tableCode : 'Bàn của bạn'}
        </p>
        <h1 className="mt-2 text-3xl font-bold">Đơn gọi món của bạn</h1>
        {order.isPending && <p className="mt-5 text-muted">Đang tải đơn…</p>}
        {order.isError && (
          <div role="alert" className="mt-5">
            <p>{orderTrackingError(order.error)}</p>
            <button
              className="btn-secondary mt-3"
              onClick={() => void order.refetch()}
            >
              Tải lại đơn
            </button>
          </div>
        )}
        {order.data && (
          <>
            <p className="mt-4 break-all text-sm text-muted">
              {order.data.orderNumber}
            </p>
            <div className="my-6 rounded-2xl bg-mint p-4 text-brand">
              <OrderStatusBadge status={order.data.status} />
              <p className="mt-1 text-sm">
                Đã nhận đơn gọi món của bạn. Thanh toán sẽ được thực hiện riêng.
              </p>
            </div>
            {order.data.items.map((item) => (
              <div
                key={item.orderItemId}
                className="flex justify-between gap-4 border-b border-stone-100 py-4"
              >
                <div className="min-w-0 break-words">
                  <p className="font-semibold">
                    {item.quantity} x {item.nameSnapshot}
                  </p>
                  {item.options.map((option) => (
                    <p
                      key={option.optionId}
                      className="mt-1 text-xs text-muted"
                    >
                      {option.name}
                      {option.quantity > 1 ? ' x ' + option.quantity : ''}
                    </p>
                  ))}
                  {item.note && (
                    <p className="mt-1 text-xs text-muted">{item.note}</p>
                  )}
                </div>
                <span className="shrink-0 text-sm">
                  {formatCurrency(item.lineTotal)}
                </span>
              </div>
            ))}
            <div className="mt-6 flex justify-between font-bold">
              <span>Tổng tiền đơn</span>
              <span>{formatCurrency(order.data.totalAmount)}</span>
            </div>
          </>
        )}
        <Link to="/menu" className="btn-primary mt-6 w-full">
          Quay lại thực đơn
        </Link>
        <Link to="/orders" className="btn-secondary mt-3 w-full">
          Theo dõi đơn
        </Link>
      </div>
    </section>
  )
}
