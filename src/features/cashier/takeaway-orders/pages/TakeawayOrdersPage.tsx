import { useState } from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { formatCurrency } from '../../../../utils/currency'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { useTakeawayOrders } from '../hooks/useTakeawayOrders'

export function TakeawayOrdersPage() {
  const user = useAppSelector((state) => state.auth.session?.user)
  const restaurantId = user?.restaurantId ?? ''
  const { orders, accept } = useTakeawayOrders(restaurantId, user?.userId ?? '')
  const [selectedId, setSelectedId] = useState<string>()
  const selected = orders.data?.find((order) => order.orderId === selectedId) ?? orders.data?.[0]
  const canAccept = selected?.status === 'PendingConfirmation' &&
    selected.paymentStatus === 'Paid' && !selected.cancellationRequested && !!selected.version

  return (
    <div className="w-full min-w-0 self-start">
      <h1 className="mb-4 text-xl font-bold">Đơn online</h1>
      {!restaurantId ? (
        <p>Chưa tìm thấy nhà hàng được phân công.</p>
      ) : (
        <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold">Chờ xác nhận {orders.data && `(${orders.data.length})`}</h2>
              <button type="button" className="btn-secondary" disabled={orders.isFetching} onClick={() => void orders.refetch()}>
                Làm mới
              </button>
            </div>
            {orders.isPending && <p role="status" className="p-5 text-sm text-slate-600">Đang tải đơn online…</p>}
            {orders.isError && <p role="alert" className="p-5 text-sm text-rose-700">{cashShiftError(orders.error)}</p>}
            {orders.isSuccess && !orders.data.length && <p className="p-5 text-sm text-slate-600">Chưa có đơn online chờ xác nhận.</p>}
            <ul className="divide-y divide-slate-100">
              {orders.data?.map((order) => (
                <li key={order.orderId}>
                  <button
                    type="button"
                    aria-pressed={order.orderId === selected?.orderId}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 aria-pressed:bg-emerald-50"
                    onClick={() => setSelectedId(order.orderId)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{order.pickupName || 'Khách đặt online'}</span>
                      <span className="block truncate text-xs text-slate-500">{order.orderNumber}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-emerald-800">{formatCurrency(order.totalAmount)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Chi tiết đơn</h2>
            {selected ? (
              <>
                <div className="mt-2 space-y-1 break-words text-sm text-slate-600">
                  <p>{selected.orderNumber}</p>
                  <p>{[selected.pickupName, selected.pickupPhone].filter(Boolean).join(' · ')}</p>
                  <p>{new Date(selected.createdAt).toLocaleString('vi-VN')}</p>
                  {selected.paymentStatus === 'Paid' && (
                    <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">Đã thanh toán</span>
                  )}
                </div>
                <ul className="my-4 divide-y divide-slate-100 border-y border-slate-100">
                  {selected.items.map((item) => (
                    <li key={item.orderItemId} className="flex justify-between gap-3 py-3 text-sm">
                      <div className="min-w-0 break-words">
                        <p className="font-medium">{item.quantity} × {item.nameSnapshot}</p>
                        {item.options.map((option) => (
                          <p key={option.optionId} className="text-xs text-slate-500">{option.quantity} × {option.name}</p>
                        ))}
                        {item.note && <p className="text-xs text-slate-500">{item.note}</p>}
                      </div>
                      <span className="shrink-0">{formatCurrency(item.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mb-4 flex justify-between gap-3 font-semibold">
                  <span>Tổng tiền</span>
                  <span className="text-emerald-800">{formatCurrency(selected.totalAmount)}</span>
                </div>
                {selected.cancellationRequested && <p className="mb-3 text-sm text-amber-800">Đơn đang có yêu cầu hủy.</p>}
                {accept.isError && accept.variables?.orderId === selected.orderId && (
                  <p role="alert" className="mb-3 text-sm text-rose-700">{cashShiftError(accept.error)}</p>
                )}
                <button type="button" className="btn-primary w-full" disabled={!canAccept || orders.isError || accept.isPending} onClick={() => accept.mutate(selected)}>
                  {accept.isPending && accept.variables?.orderId === selected.orderId ? 'Đang xác nhận…' : 'Xác nhận và chuyển bếp'}
                </button>
              </>
            ) : <p className="mt-2 text-sm text-slate-600">Chọn một đơn để xem món và thông tin nhận hàng.</p>}
          </section>
        </div>
      )}
    </div>
  )
}
