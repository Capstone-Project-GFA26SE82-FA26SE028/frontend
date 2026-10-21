import type { UserAccount } from '../types'
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
        aria-label={`View ${u.name}`}
        onClick={() => onDetail(u)}
        className="min-h-10 rounded-lg px-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
      >
        Details
      </button>
      <button
        aria-label={`Edit ${u.name}`}
        onClick={() => onEdit(u)}
        className="min-h-10 rounded-lg px-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        Edit
      </button>
      <button
        aria-label={`${u.active ? 'Deactivate' : 'Activate'} ${u.name}`}
        onClick={() => {
          onStatus(u)
        }}
        className="min-h-10 rounded-lg px-2 text-sm text-slate-500 hover:bg-slate-50"
      >
        {u.active ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  )
}
