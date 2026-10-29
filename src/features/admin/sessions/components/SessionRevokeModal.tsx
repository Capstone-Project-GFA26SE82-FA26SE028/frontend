import { Modal } from '../../../../components/Modal/Modal'
import { secondaryButton } from '../../components/AdminUI'
import type { LoginSession } from '../types/types'

export function SessionRevokeModal({
  target,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  target: LoginSession | 'all'
  pending: boolean
  error: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal
      title={target === 'all' ? 'Đăng xuất mọi phiên của tôi' : 'Thu hồi phiên'}
      closeLabel="Đóng"
      onClose={() => {
        if (!pending) onClose()
      }}
    >
      <div className="space-y-5 p-6">
        <p className="text-sm leading-6 text-slate-600">
          {target === 'all'
            ? 'Tài khoản sẽ được đăng xuất trên mọi thiết bị, bao gồm thiết bị này.'
            : target.isCurrent
              ? 'Đây là phiên hiện tại của bạn. Bạn sẽ được đưa về trang đăng nhập.'
              : 'Thiết bị này sẽ cần đăng nhập lại để truy cập tài khoản.'}
        </p>
        {target !== 'all' && (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold">{target.userName}</p>
            <p className="mt-1 break-all text-sm text-slate-500">
              {target.deviceType || 'Unknown'} ·{' '}
              {target.ipAddress || 'Chưa có địa chỉ IP'}
            </p>
          </div>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            disabled={pending}
            className={secondaryButton}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            disabled={pending}
            onClick={onConfirm}
            className="min-h-11 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {pending ? 'Đang thu hồi…' : 'Xác nhận đăng xuất'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
