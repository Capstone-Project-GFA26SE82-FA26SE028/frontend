import { useForm, useWatch } from 'react-hook-form'
import { UserAvatar } from './UserAvatar'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../../../../components/Modal/Modal'
import {
  accountFormSchema,
  type AccountFormValues,
} from '../schemas/userSchema'
import { userRoleLabel, type UserAccount, type UserRole } from '../types/types'

import { Field } from '../../../../components/Field/Field'

export function UserForm({
  user,
  roles,
  onClose,
  onSave,
}: {
  user: UserAccount | null
  roles: UserRole[]
  onClose: () => void
  onSave: (values: AccountFormValues) => Promise<string>
}) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema(!!user)),
    defaultValues: {
      userName: user?.userName || '',
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || '',
      password: '',
      avatarUrl: user?.avatarUrl || '',
    },
  })
  const avatarUrl = useWatch({ control, name: 'avatarUrl' })
  const name = useWatch({ control, name: 'name' })
  const close = () => {
    if (!isSubmitting) onClose()
  }
  return (
    <Modal
      closeLabel="Đóng"
      title={user ? 'Sửa tài khoản' : 'Thêm tài khoản'}
      onClose={close}
    >
      <form
        noValidate
        className="space-y-4 p-6"
        onSubmit={handleSubmit(async (values) => {
          const error = await onSave(values)
          if (error) setError('root', { message: error })
        })}
      >
        <fieldset disabled={isSubmitting} className="space-y-4">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-4">
            <UserAvatar src={avatarUrl} name={name} large />
            <span className="text-xs text-slate-500">
              Xem trước ảnh đại diện
            </span>
          </div>
          <Field
            label="Đường dẫn ảnh đại diện (không bắt buộc)"
            error={errors.avatarUrl?.message}
          >
            <input
              type="url"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="https://example.com/avatar.jpg"
              {...register('avatarUrl')}
              aria-invalid={!!errors.avatarUrl}
            />
          </Field>
          {avatarUrl && (
            <button
              type="button"
              className="text-sm font-medium text-rose-600"
              onClick={() =>
                setValue('avatarUrl', '', {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              Xóa ảnh
            </button>
          )}
          {(
            [
              ['userName', 'Tên đăng nhập'],
              ['name', 'Họ và tên'],
              ['email', 'Email'],
              ['phone', 'Số điện thoại (không bắt buộc)'],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label} error={errors[key]?.message}>
              <input
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                {...register(key)}
                inputMode={key === 'phone' ? 'tel' : undefined}
                placeholder={key === 'phone' ? '0901234567' : undefined}
                type={
                  key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'
                }
                autoComplete={
                  key === 'userName'
                    ? 'off'
                    : key === 'phone'
                      ? 'tel'
                      : key === 'name'
                        ? 'name'
                        : 'email'
                }
                aria-invalid={!!errors[key]}
              />
            </Field>
          ))}
          {!user && (
            <Field label="Mật khẩu" error={errors.password?.message}>
              <input
                type="password"
                autoComplete="new-password"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
            </Field>
          )}
          <Field label="Vai trò" error={errors.role?.message}>
            <select
              {...register('role')}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Chọn vai trò</option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {userRoleLabel(role.roleId)}
                </option>
              ))}
            </select>
          </Field>
        </fieldset>
        {errors.root && (
          <p role="alert" className="text-sm text-rose-600">
            {errors.root.message}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={close}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            Hủy
          </button>
          <button
            disabled={isSubmitting || !roles.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
          >
            {isSubmitting
              ? 'Đang lưu…'
              : user
                ? 'Lưu thay đổi'
                : 'Tạo tài khoản'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
