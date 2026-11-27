import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { formatCurrency } from '../../../../utils/currency'
import type { PayOsTestQr } from '../types/types'

const BANK_BIN_MAP: Record<string, string> = {
  '970422': 'MB Bank (Quân Đội)',
  '970436': 'Vietcombank',
  '970415': 'VietinBank',
  '970418': 'BIDV',
  '970407': 'Techcombank',
  '970416': 'ACB',
  '970423': 'TPBank',
  '970432': 'VPBank',
  '970405': 'Agribank',
  '970441': 'VIB',
  '970403': 'Sacombank',
  '970448': 'OCB',
}

export function PayOsTestQrModal({
  qr,
  loading,
  qrError,
  onClose,
  onEdit,
  onRetry,
}: {
  qr: (PayOsTestQr & { image: string }) | null
  loading: boolean
  qrError: string
  onClose: () => void
  onEdit: () => void
  onRetry: () => void
}) {
  return (
    <Modal title="Kiểm tra kết nối PayOS thực tế" subtitle="Tạo mã thanh toán trực tiếp từ PayOS" onClose={onClose}>
      <div className="space-y-5 p-6">
        {loading ? (
          <div role="status" className="flex flex-col items-center gap-3 py-12 text-center">
            <Icon name="refresh" size={36} className="animate-spin text-emerald-700" />
            <p className="text-sm font-semibold">Đang gọi PayOS để tạo mã thanh toán…</p>
          </div>
        ) : qrError ? (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center">
            <Icon name="ban" size={24} className="mx-auto text-rose-600" />
            <h3 className="mt-3 font-semibold text-rose-900">Không thể tạo mã thanh toán PayOS</h3>
            <p className="mt-2 text-sm text-rose-700">{qrError}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn-secondary" onClick={onEdit}>Sửa cấu hình</button>
              <button type="button" className="btn-secondary" onClick={onRetry}>Thử lại</button>
            </div>
          </div>
        ) : qr && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center sm:p-5">
            <img
              className="mx-auto aspect-square w-full max-w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
              src={qr.image}
              alt="Mã VietQR kiểm tra kết nối PayOS"
            />
            <p className="mt-3 text-sm font-semibold text-slate-900">Mã VietQR do PayOS sinh theo 3 key của quán</p>
            <p className="mt-0.5 text-sm text-slate-500">
              Số tiền: <strong className="text-emerald-800">{formatCurrency(qr.amount)}</strong>
            </p>
            <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm sm:px-4">
              {[
                ['Tên chủ tài khoản', qr.accountName?.toUpperCase()],
                ['Số tài khoản', qr.accountNumber],
                ['Ngân hàng thụ hưởng', qr.bin && BANK_BIN_MAP[qr.bin] ? `${BANK_BIN_MAP[qr.bin]} (${qr.bin})` : qr.bin],
                ['Mã đơn PayOS', qr.orderCode],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-2 gap-2 py-2">
                  <dt className="text-left text-slate-500">{label}:</dt>
                  <dd className="break-words text-right font-semibold text-slate-900">{value || '—'}</dd>
                </div>
              ))}
            </dl>
            {qr.checkoutUrl && /^https:\/\//i.test(qr.checkoutUrl) && (
              <a
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:underline"
                href={qr.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mở trực tiếp trang thanh toán PayOS
                <Icon name="arrow" size={16} />
              </a>
            )}
          </div>
        )}
        <div className="flex justify-end">
          <button type="button" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}
