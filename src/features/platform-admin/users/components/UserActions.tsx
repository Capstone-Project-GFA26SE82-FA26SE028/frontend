import { Icon } from '../../../../components/Icon/Icon'
import type { UserAccount } from '../types/types'
export type UserActionHandlers = {
  onDetail: (user: UserAccount) => void
  onEdit: (user: UserAccount) => void
  onStatus: (user: UserAccount) => void
}
export function UserActions({
  user: u,
  onDetail,
  onEdit,
  onStatus,
}: UserActionHandlers & { user: UserAccount }) {
  return (
    <div className="flex flex-wrap gap-1">
      <button
        title="Xem chi tiết"
        aria-label={`Xem ${u.name}`}
        onClick={() => onDetail(u)}
        className="flex size-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        <Icon name="eye" size={19} />
      </button>
      <button
        title="Sửa tài khoản"
        aria-label={`Sửa ${u.name}`}
        onClick={() => onEdit(u)}
        className="flex size-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
      >
        <Icon name="edit" size={19} />
      </button>
      <button
        title={u.active ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
        aria-label={`${u.active ? 'Vô hiệu hóa' : 'Kích hoạt'} ${u.name}`}
        onClick={() => {
          onStatus(u)
        }}
        className={
          'flex size-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 ' +
          (u.active
            ? 'text-rose-400 hover:bg-rose-50 hover:text-rose-600'
            : 'text-emerald-600 hover:bg-emerald-50')
        }
      >
        <Icon name={u.active ? 'ban' : 'check'} size={19} />
      </button>
    </div>
  )
}
