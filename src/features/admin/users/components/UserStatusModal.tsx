import { ConfirmAction } from '../../components/AdminUI'
import type { UserAccount } from '../types/types'
export function UserStatusModal({
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
    <ConfirmAction
      cancelLabel="Hủy"
      closeLabel="Đóng"
      title={user.active ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
      description={
        user.name +
        ' (' +
        user.email +
        '). ' +
        (user.active
          ? 'Tài khoản sẽ không còn quyền truy cập. Lịch sử tài khoản vẫn được giữ lại.'
          : 'Cho phép tài khoản đăng nhập và truy cập lại hệ thống.')
      }
      onClose={() => {
        if (!pending) onClose()
      }}
      disabled={pending}
      confirmLabel={pending ? 'Đang cập nhật…' : 'Xác nhận'}
      onConfirm={onConfirm}
    >
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </ConfirmAction>
  )
}
