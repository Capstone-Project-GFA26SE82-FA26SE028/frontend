import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toDataURL } from 'qrcode'
import { toast } from 'react-toastify'
import { Icon } from '../../../../components/Icon/Icon'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { createBillPayOsPayment } from '../api/billApi'

export function PrintPaymentSlip({
  billId,
  checkoutId,
  cashShiftId,
  canPrintQr,
  onPrint,
}: {
  billId: string
  checkoutId: string | null | undefined
  cashShiftId: string
  canPrintQr: boolean
  onPrint: (method: string, qrImage?: string) => Promise<void>
}) {
  const queryClient = useQueryClient()
  const qr = useMutation({
    onError: (error) => toast.error(cashShiftError(error)),
    mutationFn: async () => {
      if (!checkoutId) throw new Error('Không tìm thấy yêu cầu thanh toán.')

      const storageKey = `cashier:payos:${billId}:${checkoutId}:${cashShiftId}`
      const requestKey = sessionStorage.getItem(storageKey) ?? crypto.randomUUID()
      sessionStorage.setItem(storageKey, requestKey)
      let payment = await createBillPayOsPayment(billId, checkoutId, cashShiftId, requestKey)
      // The same key resumes PayOS processing on the existing payment.
      for (const delay of [800, 1500, 2500]) {
        const stillPreparing = payment.status === 'Creating' || payment.status === 'Unknown'
        const waitingForQr = payment.status === 'Pending'
          && (!payment.linkDetailsAvailable || !payment.qrCode)
          && (!payment.expiresAt || Date.parse(payment.expiresAt) > Date.now())
        if (!stillPreparing && !waitingForQr) break

        await new Promise<void>((resolve) => window.setTimeout(resolve, delay))
        payment = await createBillPayOsPayment(billId, checkoutId, cashShiftId, requestKey)
      }

      if (payment.status === 'Paid') {
        void queryClient.invalidateQueries({ queryKey: ['cashier'] })
        throw new Error('Hóa đơn đã thanh toán.')
      }
      if (payment.isVerifiedZero && ['Cancelled', 'Expired', 'Failed'].includes(payment.status)) {
        sessionStorage.removeItem(storageKey)
        throw new Error('Mã cũ đã kết thúc. Bấm in lại để tạo mã mới.')
      }
      if (payment.status === 'Pending' && payment.expiresAt && Date.parse(payment.expiresAt) <= Date.now()) {
        throw new Error('Mã PayOS đã hết hạn. Vui lòng thử lại.')
      }
      if (payment.status !== 'Pending' || !payment.linkDetailsAvailable || !payment.qrCode) {
        throw new Error('Mã PayOS chưa sẵn sàng. Vui lòng thử lại.')
      }
      return toDataURL(payment.qrCode, { margin: 4, width: 512 })
    },
  })

  return (
      <button
        type="button"
        aria-label={qr.isPending ? 'Đang lấy mã PayOS' : 'In phiếu'}
        aria-busy={qr.isPending}
        title={qr.isPending ? 'Đang lấy mã PayOS…' : 'In phiếu có VietQR'}
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50"
        disabled={!canPrintQr || !checkoutId || qr.isPending}
        onClick={() => qr.mutate(undefined, {
          onSuccess: (image) => void onPrint('Quét VietQR để chuyển khoản', image)
            .catch(() => toast.error('Không thể mở bản in có QR.')),
        })}
      >
        {qr.isPending ? (
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : (
          <Icon name="receipt" size={18} />
        )}
      </button>
  )
}
