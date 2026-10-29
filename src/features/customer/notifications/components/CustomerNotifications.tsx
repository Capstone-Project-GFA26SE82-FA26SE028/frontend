import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { useOrderTracking } from '../../order-tracking/hooks/useOrderTracking'
import { OrderStatusBadge } from '../../order-tracking/components/OrderStatusBadge'
import { orderTrackingError } from '../../order-tracking/api/orderTrackingApi'

export function CustomerNotifications() {
  const [open, setOpen] = useState(false)
  const { orders, query } = useOrderTracking(open)
  return (
    <>
      <button
        type="button"
        aria-label="Cập nhật đơn gọi món"
        title="Cập nhật đơn gọi món"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-brand transition-colors hover:bg-mint"
      >
        <Icon name="bell" size={20} />
      </button>
      {open && (
        <Modal title="Cập nhật đơn gọi món" onClose={() => setOpen(false)}>
          <div className="p-6">
            {query.isPending && (
              <p role="status" className="text-sm text-muted">
                Đang tải cập nhật…
              </p>
            )}
            {query.isError && (
              <div role="alert" className="text-sm">
                <p>{orderTrackingError(query.error)}</p>
                <button
                  className="btn-secondary mt-3"
                  disabled={query.isFetching}
                  onClick={() => void query.refetch()}
                >
                  Tải lại
                </button>
              </div>
            )}
            {orders.length > 0 && (
              <ul className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <li
                    key={order.orderId}
                    className="rounded-2xl bg-stone-50 p-4"
                  >
                    <p className="mb-2 break-all text-sm font-semibold">
                      {order.orderNumber}
                    </p>
                    <OrderStatusBadge status={order.status} />
                  </li>
                ))}
              </ul>
            )}
            {query.isSuccess && !orders.length && (
              <p className="py-6 text-center text-sm text-muted">
                Chưa có đơn gọi món.
              </p>
            )}
            <Link
              to="/orders"
              className="btn-primary mt-5 w-full"
              onClick={() => setOpen(false)}
            >
              Xem tất cả đơn
            </Link>
          </div>
        </Modal>
      )}
    </>
  )
}
