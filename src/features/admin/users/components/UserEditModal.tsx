import { Modal } from '../../../../components/Modal/Modal'
import { secondaryButton } from '../../components/AdminUI'
import { useUser, useUserRoles } from '../hooks/useUsers'
import { userApiError } from '../api/userApi'
import { UserForm } from './UserForm'
import type { UserAccount } from '../types'
import type { AccountFormValues } from '../schemas/userSchema'

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
  if (!isPending && !isError && data && roles.isSuccess)
    return (
      <UserForm
        user={data}
        roles={roles.data}
        onClose={onClose}
        onSave={(values) => onSave(values, data)}
      />
    )
  return (
    <Modal title="Edit account" onClose={onClose} closeLabel="Close">
      <div className="space-y-3 p-6">
        {isPending || roles.isPending ? (
          <p role="status">Loading account…</p>
        ) : (
          <>
            <p role="alert" className="text-rose-600">
              {userApiError(error || roles.error)}
            </p>
            <button className={secondaryButton} onClick={() => { void refetch(); void roles.refetch() }}>
              Try again
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}
