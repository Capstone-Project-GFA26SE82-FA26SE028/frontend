import { Modal } from '../../../../components/Modal/Modal'
import { Badge } from '../../components/AdminUI'
import { roleLabels, type AdminUser } from '../types'
import { type AuditEntry } from '../../activity/types'
import { dateTime } from '../../utils'
export function UserDetailModal({
  user: detail,
  history,
  restaurantName,
  onClose,
}: {
  user: AdminUser
  history: AuditEntry[]
  restaurantName: (id: string) => string
  onClose: () => void
}) {
  return (
    <Modal title="Chi tiết người dùng" onClose={onClose}>
      <div className="space-y-4 p-6">
        <h3 className="text-lg font-bold">{detail.name}</h3>
        <Badge tone={detail.active ? 'green' : 'red'}>
          {detail.active ? 'Hoạt động' : 'Đã khóa'}
        </Badge>
        <dl className="space-y-3">
          {[
            ['Email', detail.email],
            ['Điện thoại', detail.phone],
            ['Vai trò', roleLabels[detail.role]],
            ['Phạm vi', restaurantName(detail.restaurantId)],
            ['Ngày tạo', new Date(detail.created).toLocaleDateString('vi-VN')],
          ].map(([k, v]) => (
            <div
              key={k}
              className="grid grid-cols-[90px_1fr] gap-3 border-b border-slate-100 pb-3 text-sm"
            >
              <dt className="text-slate-500">{k}</dt>
              <dd className="break-words">{v}</dd>
            </div>
          ))}
        </dl>
        <h3 className="pt-2 font-semibold">Lịch sử tài khoản</h3>
        {history
          .filter((a) => a.targetId === detail.id && a.entity === 'user')
          .slice(0, 5)
          .map((a) => (
            <div key={a.id} className="rounded-xl bg-slate-50 p-3 text-sm">
              <p>{a.action}</p>
              <p className="mt-1 text-xs text-slate-400">{dateTime(a.time)}</p>
              {a.reason && <p className="mt-2 text-slate-500">{a.reason}</p>}
            </div>
          ))}
        {!history.some(
          (a) => a.targetId === detail.id && a.entity === 'user',
        ) && (
          <p className="text-sm text-slate-400">
            Chưa có thay đổi trong bản dùng thử.
          </p>
        )}
      </div>
    </Modal>
  )
}
