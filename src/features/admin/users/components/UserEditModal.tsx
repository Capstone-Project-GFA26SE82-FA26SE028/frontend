import { Modal } from '../../../../components/Modal/Modal'
import { secondaryButton } from '../../components/AdminUI'
import { useUser } from '../hooks/useUsers'
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
  if (!isPending && !isError && data)
    return (
      <UserForm
        user={data}
        roles={[]}
        onClose={onClose}
        onSave={(values) => onSave(values, data)}
      />
    )
  return (
    <Modal title="Edit account" onClose={onClose} closeLabel="Close">
      <div className="space-y-3 p-6">
        {isPending ? (
          <p role="status">Loading account…</p>
        ) : (
          <>
            <p role="alert" className="text-rose-600">
              {userApiError(error)}
            </p>
            <button className={secondaryButton} onClick={() => void refetch()}>
              Try again
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}
