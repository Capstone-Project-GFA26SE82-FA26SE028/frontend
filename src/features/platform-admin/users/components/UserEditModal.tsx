import { Modal } from '../../../../components/Modal/Modal'

import { useUser, useUserRoles } from '../hooks/useUsers'
import { userApiError } from '../api/userApi'
import { UserForm } from './UserForm'
import type { UserAccount } from '../types/types'
import type { AccountFormValues } from '../schemas/userSchema'
import { canTransferUser } from '../types/types'
import { useStaffTransfer } from '../hooks/useStaffTransfer'
import { UserRestaurantTransfer } from './UserRestaurantTransfer'

export function UserEditModal({
  id,
  onClose,
  onSave,
}: {
  id: string
  onClose: () => void
  onSave: (values: AccountFormValues, user: UserAccount) => Promise<string>
}) {
  const { data, isPending, isError, error, refetch } = useUser(id)
  const roles = useUserRoles()
  const transfer = useStaffTransfer(id)
  if (!isPending && !isError && data && roles.isSuccess)
    return (
      <UserForm
        user={data}
        roles={roles.data}
        onClose={onClose}
        onSave={(values) => onSave(values, data)}
        transferLocked={transfer.locked}
        restaurantSection={
          canTransferUser(data) || transfer.hasAttempt ? (
            <UserRestaurantTransfer user={data} model={transfer} />
          ) : undefined
        }
      />
    )
  return (
    <Modal title="Sửa tài khoản" onClose={onClose} closeLabel="Đóng">
      <div className="space-y-3 p-6">
        {isPending || roles.isPending ? (
          <p role="status">Đang tải tài khoản…</p>
        ) : (
          <>
            <p role="alert" className="text-rose-600">
              {userApiError(error || roles.error)}
            </p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              onClick={() => {
                void refetch()
                void roles.refetch()
              }}
            >
              Thử lại
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}
