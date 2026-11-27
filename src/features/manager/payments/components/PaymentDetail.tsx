import { Badge } from '../../../../components/Badge/Badge'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import type { ManagerPayment } from '../data/previewPayments'
import { methodLabels, money, paymentStatus, paymentTime } from '../utils/payments'

export function PaymentDetail({ payment, onClose }: { payment: ManagerPayment; onClose: () => void }) {
  const status = paymentStatus[payment.status]
  const details = [
    ['Mã giao dịch', payment.id], ['Hóa đơn', payment.billNumber],
    ['Kênh bán', payment.channel === 'DineIn' ? 'Tại bàn' : 'Mang đi'], ['Vị trí', payment.table],
    ['Phương thức', methodLabels[payment.method]], ['Thu ngân', payment.cashier],
    ['Ca làm việc', payment.shift], ['Thời gian tạo', paymentTime(payment.createdAt)],
    ['Thanh toán lúc', payment.paidAt ? paymentTime(payment.paidAt) : 'Chưa thanh toán'],
    ...(payment.reference ? [['Mã tham chiếu PayOS', payment.reference]] : []),
  ]
  return (
    <Modal title="Chi tiết thanh toán" subtitle="Dữ liệu minh họa · Không phải giao dịch thực tế" onClose={onClose}>
      <div className="space-y-6 p-6">
        <div className="rounded-2xl bg-emerald-50 px-5 py-6 text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-white text-emerald-700"><Icon name="receipt" size={24} /></span>
          <p className="text-sm text-slate-600">Số tiền giao dịch</p>
          <p className="mb-3 mt-1 text-3xl font-bold tracking-tight text-brand-dark">{money(payment.amount)}</p>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
        <dl className="divide-y divide-slate-100 text-sm">
          {details.map(([label, value]) => (
            <div key={label} className="flex flex-wrap justify-between gap-2 py-3">
              <dt className="text-slate-500">{label}</dt><dd className="max-w-full break-all font-medium text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>
        {payment.cashReceived !== null && (
          <dl className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between gap-3"><dt>Tiền khách đưa</dt><dd className="font-semibold">{money(payment.cashReceived)}</dd></div>
            <div className="flex justify-between gap-3"><dt>Tiền thừa</dt><dd className="font-semibold">{money(payment.cashReceived - payment.amount)}</dd></div>
          </dl>
        )}
        {payment.note && <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">{payment.note}</p>}
        <button type="button" className="btn-secondary w-full" onClick={onClose}>Đóng chi tiết</button>
      </div>
    </Modal>
  )
}
