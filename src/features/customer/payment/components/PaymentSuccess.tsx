import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import type { Invoice } from '../../billing-feedback/types'

export function PaymentSuccess({ invoice }: { invoice: Invoice }) {
  return (
    <section
      className="panel mt-8 overflow-hidden text-center"
      aria-labelledby="payment-success-title"
    >
      <div className="bg-mint/60 px-5 py-8 sm:p-10">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/15">
          <Icon name="check" size={38} />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand">
          Bản xem thử giao diện
        </p>
        <h2
          id="payment-success-title"
          className="mt-3 text-2xl font-bold sm:text-3xl"
        >
          Thanh toán thành công
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Cảm ơn bạn đã chọn Mộc cho bữa ăn hôm nay.
        </p>
      </div>
      <div className="p-5 sm:p-8">
        <p className="text-sm text-muted">Số tiền thanh toán mẫu</p>
        <p className="mt-2 text-3xl font-bold text-brand">
          {formatCurrency(invoice.total)}
        </p>
        <dl className="my-6 space-y-3 rounded-2xl bg-cream p-4 text-sm text-left">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted">Phương thức</dt>
            <dd className="font-semibold">
              {invoice.method === 'cash'
                ? 'Tiền mặt tại bàn'
                : 'Chuyển khoản ngân hàng'}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted">Mã hóa đơn</dt>
            <dd className="font-semibold">{invoice.code}</dd>
          </div>
        </dl>
        <Link to={`/bill/${invoice.id}`} className="btn-primary w-full">
          Xem hóa đơn & đánh giá <Icon name="arrow" size={18} />
        </Link>
        <Link to="/menu" className="btn-secondary mt-3 w-full">
          Về thực đơn
        </Link>
        <p className="mt-5 text-xs leading-5 text-muted">
          Đây là kết quả mô phỏng, chưa thu tiền thực tế. Thuế, phí và ưu đãi
          chưa được áp dụng trong lượt xem thử này.
        </p>
      </div>
    </section>
  )
}
