import { ConfirmAction, Field, fieldClass } from '../../components/AdminUI'
import type { AdminUser } from '../types'
export function UserStatusModal({
  user: target,
  reason,
  error,
  onReason,
  onClose,
  onConfirm,
}: {
  user: AdminUser
  reason: string
  error: string
  onReason: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <ConfirmAction
      title={target.active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
      description={`${target.name} (${target.email}). Thao tác mẫu không thay đổi phiên đăng nhập thật; lịch sử tài khoản được giữ nguyên.`}
      onClose={onClose}
      disabled={target.active && reason.trim().length < 10}
      onConfirm={onConfirm}
    >
      {target.active && (
        <Field label="Lý do khóa (ít nhất 10 ký tự)">
          <textarea
            value={reason}
            onChange={(e) => onReason(e.target.value)}
            rows={3}
            maxLength={500}
            className={fieldClass}
          />
        </Field>
      )}
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </ConfirmAction>
  )
}
