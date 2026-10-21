import { Icon } from '../../../../components/Icon/Icon'
import { primaryButton } from '../../components/AdminUI'

export function UserPageHeader({
  canCreate,
  onCreate,
}: {
  canCreate: boolean
  onCreate: () => void
}) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          User accounts
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Manage account details, roles, and access.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          disabled={!canCreate}
          className={primaryButton}
          onClick={onCreate}
        >
          <Icon name="plus" size={18} />
          Add account
        </button>
      </div>
    </header>
  )
}
