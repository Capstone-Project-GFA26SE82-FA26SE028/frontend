import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import { Badge, secondaryButton } from '../../components/AdminUI'
import { userRoleLabel } from '../types/types'
import { useUser } from '../hooks/useUsers'
import { userApiError } from '../api/userApi'
import { UserAvatar } from './UserAvatar'

function formatDate(value: string | null) {
  if (!value) return { date: 'Chưa có dữ liệu', time: '—' }
  const date = new Date(value)
  return {
    date: date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

export function UserDetailModal({
  id,
  onClose,
}: {
  id: string
  onClose: () => void
}) {
  const { data: user, isPending, isError, error, refetch } = useUser(id)
  return (
    <Modal title="Thông tin người dùng" onClose={onClose} closeLabel="Đóng">
      {isPending ? (
        <p role="status" className="p-10 text-center text-slate-500">
          Đang tải tài khoản…
        </p>
      ) : isError ? (
        <div className="space-y-3 p-6">
          <p role="alert" className="text-rose-600">
            {userApiError(error)}
          </p>
          <button className={secondaryButton} onClick={() => void refetch()}>
            Thử lại
          </button>
        </div>
      ) : (
        user && (
          <div className="p-5 sm:p-6">
            <section className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-[#f1f8f3] to-white p-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-16 size-44 rounded-full border-[24px] border-emerald-100/50"
              />
              <div className="relative flex flex-wrap items-start justify-between gap-3">
                <div className="rounded-full bg-white p-1.5 shadow-sm ring-1 ring-emerald-100">
                  <UserAvatar src={user.avatarUrl} name={user.name} large />
                </div>
                <Badge tone={user.active ? 'green' : 'red'}>
                  {user.active ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                </Badge>
              </div>
              <h3 className="relative mt-4 break-words text-2xl font-bold tracking-tight text-slate-900">
                {user.name}
              </h3>
              <p className="relative mt-1 break-all text-sm text-slate-500">
                @{user.userName}
              </p>
              <div className="relative mt-4 inline-flex max-w-full items-center gap-2 rounded-lg border border-emerald-200/70 bg-white/80 px-3 py-2 text-sm font-medium text-emerald-800">
                <Icon name="shield" size={16} />
                <span>{userRoleLabel(user.role)}</span>
              </div>
            </section>

            <section className="mt-6" aria-labelledby="user-contact-heading">
              <h4
                id="user-contact-heading"
                className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500"
              >
                Thông tin liên hệ
              </h4>
              <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 px-4">
                {[
                  { label: 'Địa chỉ email', value: user.email, icon: 'mail' },
                  {
                    label: 'Số điện thoại',
                    value: user.phone || 'Chưa cung cấp',
                    icon: 'phone',
                  },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center gap-3 py-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <Icon name={icon} size={18} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="mt-1 break-all text-sm font-medium text-slate-800">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            <dl className="mt-4 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
              {[
                { label: 'Ngày tạo', value: user.created },
                { label: 'Cập nhật gần nhất', value: user.updated },
              ].map(({ label, value }) => {
                const date = formatDate(value)
                return (
                  <div key={label} className="rounded-xl bg-slate-50 p-3.5">
                    <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Icon name="clock" size={14} />
                      {label}
                    </dt>
                    <dd className="mt-2 text-sm font-semibold text-slate-700">
                      {date.date}
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        {date.time}
                      </span>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        )
      )}
    </Modal>
  )
}
