import { useForm, useWatch } from 'react-hook-form'
import { Icon } from '../../../../components/Icon/Icon'
import { RoleBadge } from './RoleBadge'
import { UserAvatar } from '../../users/components/UserAvatar'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  roleAssignmentSchema,
  type RoleAssignmentValues,
} from '../schemas/roleAssignmentSchema'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Field,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
import type { RoleAccount, SystemRole } from '../types/types'

export function RoleAssignmentModal({
  user,
  roles,
  onClose,
  onSave,
}: {
  user: RoleAccount
  roles: SystemRole[]
  onClose: () => void
  onSave: (value: RoleAssignmentValues) => Promise<string>
}) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RoleAssignmentValues>({
    resolver: zodResolver(roleAssignmentSchema),
    defaultValues: { role: user.roleId },
  })
  const role = useWatch({ control, name: 'role' })
  const close = () => {
    if (!isSubmitting) onClose()
  }
  return (
    <Modal title="Đổi vai trò" closeLabel="Đóng" onClose={close}>
      <form
        noValidate
        className="space-y-5 p-5 sm:p-6"
        onSubmit={handleSubmit(async (values) => {
          const message = await onSave(values)
          if (message) setError('root', { message })
        })}
      >
        <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white">
          <div className="flex items-center gap-4 p-4 sm:p-5">
            <div className="shrink-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-emerald-100">
              <UserAvatar
                src={user.avatarUrl}
                name={user.fullName || user.userName}
                large
              />
            </div>
            <div className="min-w-0">
              <h3 className="break-words text-xl font-semibold tracking-tight text-slate-900">
                {user.fullName || user.userName}
              </h3>
              <p className="mt-1 break-all text-sm text-slate-500">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-100/80 bg-white/70 px-4 py-3 sm:px-5">
            <span className="text-sm text-slate-500">Vai trò hiện tại</span>
            <RoleBadge
              id={user.roleId}
              name={
                roles.find((item) => item.roleId === user.roleId)?.roleName ||
                user.roleId
              }
            />
          </div>
        </section>
        <Field label="Vai trò mới" error={errors.role?.message}>
          <select
            className={`${fieldClass} min-h-12 rounded-xl border-slate-200 font-medium disabled:bg-slate-50`}
            disabled={isSubmitting}
            aria-invalid={!!errors.role}
            {...register('role')}
          >
            {!roles.some((item) => item.roleId === user.roleId) && (
              <option value={user.roleId}>{user.roleId}</option>
            )}
            {roles.map((item) => (
              <option key={item.roleId} value={item.roleId}>
                {item.roleName}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-600">
          <Icon
            name="shield"
            size={18}
            className="mt-1 shrink-0 text-slate-400"
          />
          <div>
            <p>Tài khoản sẽ cần đăng nhập lại.</p>
            {user.roleId === 'admin' && (
              <p className="mt-1 text-amber-800">
                Phải có ít nhất một quản trị viên đang hoạt động.
              </p>
            )}
          </div>
        </div>
        {errors.root && (
          <p
            role="alert"
            className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"
          >
            {errors.root.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={isSubmitting}
            className={`${secondaryButton} justify-center`}
            onClick={close}
          >
            Hủy
          </button>
          <button
            disabled={isSubmitting || role === user.roleId || !roles.length}
            className={`${primaryButton} justify-center`}
          >
            {isSubmitting ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
