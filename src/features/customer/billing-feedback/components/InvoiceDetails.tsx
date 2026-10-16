import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import type { Invoice } from '../types'

export function InvoiceDetails({ invoice }: { invoice: Invoice }) {
  const paid = invoice.status === 'PAID'
  return (
    <article className="panel overflow-hidden">
      <header className="border-b border-dashed border-stone-200 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xl font-bold text-brand">
            <Icon name="leaf" size={26} /> Mộc
          </span>
          <span
            className={`rounded-full px-3 py-2 text-xs font-semibold ${paid ? 'bg-mint text-brand' : 'bg-amber-50 text-amber-800'}`}
          >
            {paid ? 'Đã thanh toán' : 'Chờ thanh toán'}
          </span>
        </div>
        <h2 className="mt-6 text-xl font-bold">Chi tiết hóa đơn</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Mã hóa đơn</dt>
            <dd className="mt-1 break-words font-semibold">{invoice.code}</dd>
          </div>
          <div>
            <dt className="text-muted">Vị trí</dt>
            <dd className="mt-1 font-semibold">{invoice.tableName}</dd>
          </div>
          <div>
            <dt className="text-muted">Ngày lập</dt>
            <dd className="mt-1">
              {new Date(invoice.issuedAt).toLocaleString('vi-VN')}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Phương thức</dt>
            <dd className="mt-1">
              {invoice.method === 'bank'
                ? 'Chuyển khoản ngân hàng'
                : invoice.method === 'cash'
                  ? 'Tiền mặt'
                  : 'Chưa chọn'}
            </dd>
          </div>
        </dl>
      </header>
      <div className="px-5 sm:px-8">
        <ul className="divide-y divide-stone-100">
          {invoice.items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 py-5">
              <img
                src={item.image}
                alt=""
                className="size-14 shrink-0 rounded-xl object-cover sm:size-16"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-6">{item.name}</p>
                <p className="mt-1 text-xs text-muted">{item.option}</p>
                {item.note && (
                  <p className="mt-1 break-words text-xs text-muted">
                    Ghi chú: {item.note}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
                  <span className="text-muted">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </span>
                  <strong>
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </strong>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <dl className="space-y-3 border-t border-dashed border-stone-200 py-5 text-sm">
          {[
            ['Tiền món', invoice.subtotal],
            ['Thuế VAT', invoice.tax],
            ['Phí dịch vụ', invoice.serviceFee],
            ['Ưu đãi', invoice.discount > 0 ? -invoice.discount : 0],
          ].map(([label, amount]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-muted">{label}</dt>
              <dd className="font-medium">{formatCurrency(Number(amount))}</dd>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
            <dt className="font-bold">Tổng thanh toán</dt>
            <dd
              data-testid="invoice-total"
              className="text-2xl font-bold text-brand"
            >
              {formatCurrency(invoice.total)}
            </dd>
          </div>
        </dl>
      </div>
      {paid && invoice.paidAt && (
        <p className="flex items-start gap-2 bg-mint/60 px-5 py-4 text-xs leading-5 text-brand sm:px-8">
          <Icon name="check" size={16} /> Đã thanh toán lúc{' '}
          {new Date(invoice.paidAt).toLocaleString('vi-VN')}. Cảm ơn bạn đã ghé
          Mộc!
        </p>
      )}
    </article>
  )
}
