import { Modal } from '../../../../components/Modal/Modal'
import type { UserAccount } from '../types/types'
export function UserActivationModal({
  user,
  error,
  pending,
  onClose,
  onConfirm,
}: {
  user: UserAccount
  error: string
  pending: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal
      title={user.active ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
      onClose={() => {
        if (!pending) onClose()
      }}
      closeLabel={'Đóng'}
    >
      <div className="space-y-5 p-6">
        <p className="text-sm leading-6 text-slate-600">
          {user.name +
            ' (' +
            user.email +
            '). ' +
            (user.active
              ? 'Tài khoản sẽ không còn quyền truy cập. Lịch sử tài khoản vẫn được giữ lại.'
              : 'Cho phép tài khoản đăng nhập và truy cập lại hệ thống.')}
        </p>
        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              if (!pending) onClose()
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            {'Hủy'}
          </button>
          <button
            disabled={pending}
            onClick={onConfirm}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
          >
            {pending ? 'Đang cập nhật…' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
