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
          Tài khoản người dùng
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Quản lý thông tin tài khoản, vai trò và quyền truy cập.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          disabled={!canCreate}
          className={primaryButton}
          onClick={onCreate}
        >
          <Icon name="plus" size={18} />
          Thêm tài khoản
        </button>
      </div>
    </header>
  )
}
