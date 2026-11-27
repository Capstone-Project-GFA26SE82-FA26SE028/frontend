import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../../../components/Badge/Badge'
import { HomeHeader } from '../../../../components/HomeHeader/HomeHeader'
import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import { TakeawayOrderItems } from '../components/TakeawayOrderItems'
import { useTakeawayOrders } from '../hooks/useTakeawayOrders'

const statuses: Record<string, { label: string; tone: 'amber' | 'blue' | 'green' | 'slate' | 'red' }> = {
  PendingPayment: { label: 'Chờ thanh toán', tone: 'amber' },
  PendingConfirmation: { label: 'Chờ nhà hàng xác nhận', tone: 'amber' },
  Accepted: { label: 'Đã xác nhận', tone: 'blue' },
  Cooking: { label: 'Đang chuẩn bị', tone: 'blue' },
  ReadyForPickup: { label: 'Sẵn sàng nhận món', tone: 'green' },
  Completed: { label: 'Đã nhận món', tone: 'green' },
  Cancelled: { label: 'Đã hủy', tone: 'slate' },
  Rejected: { label: 'Nhà hàng đã từ chối', tone: 'red' },
}

export function TakeawayOrdersPage() {
  const { orders, cancellation, page, setPage, status, changeStatus, hasNextPage } = useTakeawayOrders()

  const [selectedOrder, setSelectedOrder] = useState<{ restaurantId: string; orderId: string } | null>(null)
  const [cancelNotice, setCancelNotice] = useState('')
  const cancelError = cancellation.error
  const cancelMessage = axios.isAxiosError(cancelError)
    ? cancelError.response?.data?.message
    : cancelError?.message

  return (
    <div lang="vi" className="min-h-dvh bg-[#faf9f6] text-[#173e32]">
      <HomeHeader />
      <main className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/restaurants" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <Icon name="chevron" size={16} className="rotate-180" />
          Xem nhà hàng
        </Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Đơn của tôi</h1>
        <div aria-label="Lọc theo trạng thái đơn" role="group" className="flex gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white px-2">
          {[['', 'Tất cả'], ...Object.entries(statuses).map(([value, item]) => [value, item.label])].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => changeStatus(value)}
              className="min-h-11 shrink-0 border-b-2 border-transparent px-3 text-sm font-medium text-muted hover:text-brand aria-pressed:border-brand aria-pressed:text-brand"
            >
              {label}
            </button>
          ))}
        </div>
        {cancelNotice && <p role="status" className="text-sm text-brand">{cancelNotice}</p>}
        {orders.isPending ? (
          <p role="status">Đang tải đơn hàng…</p>
        ) : orders.isError ? (
          <div className="panel space-y-3 p-5">
            <p role="alert" className="text-sm text-rose-800">Không thể tải danh sách đơn. Vui lòng thử lại.</p>
            <button type="button" className="btn-secondary" disabled={orders.isFetching} onClick={() => void orders.refetch()}>Thử lại</button>
          </div>
        ) : orders.data.items.length === 0 ? (
          <p className="panel p-5 text-sm text-muted">{page === 1 ? (status ? 'Không có đơn ở trạng thái này.' : 'Bạn chưa có đơn mang đi.') : 'Không còn đơn hàng.'}</p>
        ) : (
          <ul className="space-y-3">
            {orders.data.items.map((order) => {
              const status = statuses[order.status]
              return (
                <li key={order.orderId}>
                  <article

                    className="group block rounded-2xl border border-stone-200 bg-white px-4 transition-colors hover:border-emerald-300 focus-visible:outline-2 focus-visible:outline-brand sm:px-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 py-3">
                      {order.restaurantName && <span className="font-semibold">{order.restaurantName}</span>}
                      <time className="text-xs text-muted" dateTime={order.createdAt}>
                        {new Date(order.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                      </time>
                      <Badge tone={status?.tone ?? 'slate'}>{status?.label ?? 'Đang cập nhật'}</Badge>
                    </div>
                    <TakeawayOrderItems items={order.items} />
                    <div className="grid gap-3 border-t border-stone-100 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <span className="text-muted">Tổng tiền ({order.items.reduce((sum, item) => sum + item.quantity, 0)} món) <strong className="ml-1 whitespace-nowrap text-brand">{formatCurrency(order.totalAmount)}</strong></span>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {order.status === 'PendingPayment' && order.restaurantId && (
                          <button
                            type="button"
                            className="inline-flex min-h-10 items-center rounded-lg border border-rose-200 px-3 py-2 font-semibold text-rose-700 hover:bg-rose-50"
                            onClick={() => {
                              if (!order.restaurantId) return
                              cancellation.reset()
                              setCancelNotice('')
                              setSelectedOrder({ restaurantId: order.restaurantId, orderId: order.orderId })
                            }}
                          >
                            Hủy đơn
                          </button>
                        )}
                      {order.restaurantId && (
                        <Link
                          to={`/restaurants/${order.restaurantId}/checkout?order=${encodeURIComponent(order.orderId)}`}
                          className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-mint px-3 py-2 font-semibold text-brand hover:bg-emerald-100"
                        >
                        {order.status === 'PendingPayment' ? 'Xem thanh toán' : 'Xem chi tiết'}
                        <Icon name="chevron" size={15} />
                        </Link>
                      )}
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
        {(page > 1 || hasNextPage) && (
          <nav aria-label="Phân trang đơn hàng" className="flex items-center justify-between gap-3">
            <button type="button" className="btn-secondary" disabled={page === 1 || orders.isFetching} onClick={() => setPage(page - 1)}>Trang trước</button>
            <span className="text-sm text-muted">Trang {page}</span>
            <button type="button" className="btn-secondary" disabled={!hasNextPage || orders.isFetching} onClick={() => setPage(page + 1)}>Trang sau</button>
          </nav>
        )}
      </main>
      {selectedOrder && (
        <Modal title="Hủy đơn mang đi?" onClose={() => {
          if (!cancellation.isPending) setSelectedOrder(null)
        }}>
          <div className="space-y-4 p-5">
            <p className="text-sm text-muted">Bạn có muốn hủy đơn đang chờ thanh toán này?</p>
            {cancellation.isError && (
              <p role="alert" className="text-sm text-rose-700">
                {typeof cancelMessage === 'string' && cancelMessage ? cancelMessage : 'Chưa xác nhận được kết quả hủy. Vui lòng kiểm tra lại đơn trước khi thanh toán.'}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" className="btn-secondary" disabled={cancellation.isPending} onClick={() => setSelectedOrder(null)}>Giữ đơn</button>
              <button
                type="button"
                className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-50"
                disabled={cancellation.isPending}
                onClick={() => cancellation.mutate(selectedOrder, {
                  onSuccess: (status) => {
                    setCancelNotice(status === 'Cancelled' ? 'Đã hủy đơn.' : 'Đã gửi yêu cầu hủy. Hệ thống đang cập nhật trạng thái đơn.')
                    setSelectedOrder(null)
                  },
                })}
              >
                {cancellation.isPending ? 'Đang hủy…' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}