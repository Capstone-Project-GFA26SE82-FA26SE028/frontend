import { ConfirmAction } from '../../components/AdminUI'
import type { UserAccount } from '../types'
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
      cancelLabel="Cancel"
      closeLabel="Close"
      title={user.active ? 'Deactivate account' : 'Activate account'}
      description={
        user.name +
        ' (' +
        user.email +
        '). ' +
        (user.active
          ? 'This account will no longer have access. Account history will be retained.'
          : 'Allow this account to sign in and access the system again.')
      }
      onClose={() => {
        if (!pending) onClose()
      }}
      disabled={pending}
      confirmLabel={pending ? 'Updating…' : 'Confirm'}
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
