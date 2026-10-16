import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import { submitFeedback } from '../billingSlice'
import { InvoiceDetails } from '../components/InvoiceDetails'
import { FeedbackForm } from '../components/FeedbackForm'
import { FeedbackStatus } from '../components/FeedbackStatus'

export function BillingFeedbackPage() {
  const { invoiceId } = useParams()
  const dispatch = useAppDispatch()
  const invoices = useAppSelector((s) => s.customerBilling.invoices)
  const allOrders = useAppSelector((s) => s.orders.orders)
  const paidIds = new Set(invoices.flatMap((item) => item.orderIds ?? []))
  const orders = allOrders.filter((order) => !paidIds.has(order.id))
  const invoice = invoiceId
    ? invoices.find((item) => item.id === invoiceId)
    : !orders.length
      ? invoices.find((item) => item.orderIds?.length)
      : undefined
  const feedback = useAppSelector((s) =>
    invoice ? s.customerBilling.feedback[invoice.id] : undefined,
  )
  const total = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (value, item) => value + item.quantity * item.unitPrice,
        0,
      ),
    0,
  )

  return (
    <section className="mx-auto max-w-6xl py-6 pb-12">
      <Link
        to="/payment"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand"
      >
        <Icon name="arrow" size={16} className="rotate-180" /> Quay lại thanh
        toán
      </Link>
      <p className="eyebrow mt-4">Một bữa ngon, một lời chia sẻ</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        Hóa đơn & đánh giá
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
        Xem lại bữa ăn và gửi đôi lời đến Mộc.
      </p>
      {invoice?.isPreview && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <Icon name="receipt" />
          <p>
            <strong>Hóa đơn mẫu để xem giao diện.</strong> Dữ liệu và đánh giá ở
            đây không được gửi đến nhà hàng, không thay đổi trạng thái thanh
            toán của bạn.
          </p>
        </div>
      )}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        {invoice ? (
          <InvoiceDetails invoice={invoice} />
        ) : (
          <div className="panel p-6 sm:p-8">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-mint text-brand">
              <Icon name="receipt" size={28} />
            </span>
            <h2 className="mt-5 text-xl font-bold">
              {invoiceId
                ? 'Không tìm thấy hóa đơn'
                : orders.length
                  ? 'Hóa đơn đang chờ xác nhận'
                  : 'Bạn chưa có hóa đơn'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {invoiceId
                ? 'Vui lòng kiểm tra lại đường dẫn hoặc liên hệ nhân viên.'
                : orders.length
                  ? 'Nhà hàng sẽ cung cấp hóa đơn sau khi kiểm tra các món và xác nhận thanh toán.'
                  : 'Hóa đơn của bữa ăn sẽ xuất hiện tại đây sau khi nhà hàng xác nhận.'}
            </p>
            {!invoiceId && orders.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-between gap-3 rounded-2xl bg-cream p-4">
                <span className="text-sm">
                  Tạm tính · {orders.length} lượt gọi
                </span>
                <strong className="text-brand">{formatCurrency(total)}</strong>
                <p className="w-full text-xs text-muted">
                  Chưa bao gồm thuế, phí và ưu đãi.
                </p>
              </div>
            )}
            <Link to="/bill/preview" className="btn-secondary mt-6">
              Xem hóa đơn mẫu <Icon name="arrow" size={16} />
            </Link>
          </div>
        )}
        {invoice?.status === 'PAID' && !feedback ? (
          <FeedbackForm
            key={invoice.id}
            isPreview={invoice.isPreview}
            onSubmit={(values) =>
              dispatch(
                submitFeedback({
                  ...values,
                  invoiceId: invoice.id,
                  createdAt: new Date().toISOString(),
                }),
              )
            }
          />
        ) : (
          <FeedbackStatus feedback={feedback} isPreview={invoice?.isPreview} />
        )}
      </div>
    </section>
  )
}
