import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { requestPayment } from '../../order-tracking/orderSlice'
import { PaymentSummary } from '../components/PaymentSummary'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { PaymentPendingStatus } from '../components/PaymentPendingStatus'
import type { PaymentMethod } from '../types'
export function PaymentPage() {
  const orders = useAppSelector((s) => s.orders.orders)
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
      {orders.length ? (
        <div className="panel mt-8 p-6 sm:p-8">
          <PaymentSummary total={total} orderCount={orders.length} />
          <PaymentMethodSelector
            method={method}
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
