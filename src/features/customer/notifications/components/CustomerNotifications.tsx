import { useState } from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'

export function CustomerNotifications() {
  const [open, setOpen] = useState(false)
  const orders = useAppSelector((state) => state.orders.orders)

  return (
    <>
      <button
        type="button"
        aria-label="Thông báo"
        title="Thông báo"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-brand transition-colors hover:bg-mint"
      >
        <Icon name="bell" size={20} />
      </button>
      {open && (
        <Modal title="Thông báo của bạn" onClose={() => setOpen(false)}>
          <div className="p-6">
            {orders.length ? (
              <>
                <p className="mb-5 text-xs leading-5 text-muted">
                  Theo dõi các lượt gọi món và yêu cầu thanh toán của bạn.
                </p>
                <ul className="space-y-3">
                  {orders.map((order, index) => (
                    <li
                      key={order.id}
                      className="flex gap-3 rounded-2xl bg-mint p-4"
                    >
                      <Icon
                        name={order.paymentRequested ? 'clock' : 'receipt'}
                        className="mt-0.5 text-brand"
                      />
                      <div>
                        <h3 className="text-sm font-semibold">
                          {order.paymentRequested
                            ? 'Chờ xác nhận thanh toán'
                            : 'Lượt gọi món chờ xác nhận'}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-muted">
                          Lượt gọi món {orders.length - index} ·{' '}
                          {order.items.reduce(
                            (total, item) => total + item.quantity,
                            0,
                          )}{' '}
                          món
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="py-8 text-center">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-mint text-brand">
                  <Icon name="bell" size={28} />
                </span>
                <h3 className="mt-5 text-lg font-bold">Chưa có thông báo</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Các cập nhật về đơn hàng sẽ hiển thị tại đây.
                </p>
                <p className="mt-4 text-xs leading-5 text-muted">
                  Cần hỗ trợ ngay? Chọn “Gọi phục vụ” trên thanh menu.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
