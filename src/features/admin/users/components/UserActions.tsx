import type { AdminUser } from '../types'
export type UserActionHandlers = {
  onDetail: (user: AdminUser) => void
  onEdit: (user: AdminUser) => void
  onStatus: (user: AdminUser) => void
}
export function UserActions({
  user: u,
  onDetail,
  onEdit,
  onStatus,
}: UserActionHandlers & { user: AdminUser }) {
  return (
    <div className="flex flex-wrap gap-1">
      <button
        aria-label={`Xem ${u.name}`}
        onClick={() => onDetail(u)}
        className="min-h-10 rounded-lg px-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
      >
        Chi tiết
      </button>
      <button
        aria-label={`Sửa ${u.name}`}
        onClick={() => onEdit(u)}
        className="min-h-10 rounded-lg px-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        Sửa
      </button>
      <button
        aria-label={`${u.active ? 'Khóa' : 'Mở khóa'} ${u.name}`}
        onClick={() => {
          onStatus(u)
        }}
        className="min-h-10 rounded-lg px-2 text-sm text-slate-500 hover:bg-slate-50"
      >
        {u.active ? 'Khóa' : 'Mở khóa'}
      </button>
    </div>
  )
}
