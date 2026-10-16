import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { requestPayment } from '../../order-tracking/orderSlice'
import { PaymentSummary } from '../components/PaymentSummary'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { PaymentPendingStatus } from '../components/PaymentPendingStatus'
import type { PaymentMethod } from '../types'
import { completePreviewPayment } from '../../billing-feedback/billingSlice'
import { PaymentSuccess } from '../components/PaymentSuccess'
export function PaymentPage() {
  const allOrders = useAppSelector((s) => s.orders.orders)
  const invoices = useAppSelector((s) => s.customerBilling.invoices)
  const paidIds = new Set(invoices.flatMap((invoice) => invoice.orderIds ?? []))
  const orders = allOrders.filter((order) => !paidIds.has(order.id))
  const latestInvoice = invoices.find((invoice) => invoice.orderIds?.length)
  const dispatch = useAppDispatch()
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const requested = orders.length > 0 && orders.every((o) => o.paymentRequested)
  const total = orders.reduce(
    (s, o) => s + o.items.reduce((n, i) => n + i.quantity * i.unitPrice, 0),
    0,
  )
  return (
    <section className="mx-auto max-w-3xl py-6 pb-12">
      <p className="eyebrow">Cảm ơn bạn đã ghé Mộc</p>
      <h1 className="mt-2 text-4xl font-bold">Thanh toán bữa ăn</h1>
      {!orders.length && latestInvoice ? (
        <PaymentSuccess invoice={latestInvoice} />
      ) : orders.length ? (
        <div className="panel mt-8 p-6 sm:p-8">
          <PaymentSummary total={total} orderCount={orders.length} />
          <PaymentMethodSelector
            method={requested ? (orders[0].method ?? method) : method}
            disabled={requested}
            onChange={setMethod}
          />
          {requested ? (
            <PaymentPendingStatus />
          ) : (
            <button
              className="btn-primary mt-4 w-full"
              onClick={() => dispatch(requestPayment(method))}
            >
              Yêu cầu thanh toán
            </button>
          )}
          <div className="mt-5 rounded-2xl border border-dashed border-brand/25 bg-mint/40 p-4">
            <p className="text-sm font-semibold text-brand">
              Thử luồng thanh toán
            </p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Xem màn hình thành công và đánh giá bằng các món bạn vừa gọi. Chưa
              phát sinh giao dịch thực tế.
            </p>
            <button
              type="button"
              className="btn-secondary mt-3 w-full"
              onClick={() =>
                dispatch(
                  completePreviewPayment({
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    method: requested ? (orders[0].method ?? method) : method,
                    orders,
                  }),
                )
              }
            >
              Mô phỏng thanh toán thành công
            </button>
          </div>
          <Link
            to="/orders"
            className="mt-5 flex min-h-11 items-center justify-center text-sm font-semibold text-brand"
          >
            Quay lại đơn của bạn
          </Link>
        </div>
      ) : (
        <div className="panel mt-8 p-8">
          <p>Bạn chưa có đơn cần thanh toán.</p>
          <Link to="/menu" className="btn-primary mt-5">
            Xem thực đơn
          </Link>
        </div>
      )}
    </section>
  )
}
