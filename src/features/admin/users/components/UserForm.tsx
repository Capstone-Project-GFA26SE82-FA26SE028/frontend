import { useEffect, useRef, useState } from 'react'
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
import { Icon } from '../../../../components/Icon/Icon'

export function UserForm({
  user,
  roles,
  onClose,
  onSave,
}: {
  user: UserAccount | null
  roles: UserRole[]
  onClose: () => void
  onSave: (values: AccountFormValues, avatarFile?: File) => Promise<string>
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
  const avatarInput = useRef<HTMLInputElement>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<{
    file: File
    url: string
  }>()
  useEffect(() => {
    if (selectedAvatar) return () => URL.revokeObjectURL(selectedAvatar.url)
  }, [selectedAvatar])
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
          const error = await onSave(values, selectedAvatar?.file)
          if (error) setError('root', { message: error })
        })}
      >
        <fieldset disabled={isSubmitting} className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-slate-50 p-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar.url}
                  alt="Ảnh đại diện xem trước"
                  className="size-full object-cover"
                />
              ) : (
                <UserAvatar src={avatarUrl} name={name} />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                Ảnh đại diện
              </p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {selectedAvatar?.file.name ||
                  'JPG, PNG hoặc WebP · Tối đa 2 MB'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <button
                  type="button"
                  onClick={() => avatarInput.current?.click()}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
                >
                  <Icon name="edit" size={14} />
                  {selectedAvatar || avatarUrl ? 'Đổi ảnh' : 'Chọn ảnh'}
                </button>
                {(selectedAvatar || avatarUrl) && (
                  <button
                    type="button"
                    className="min-h-9 text-xs font-medium text-rose-700"
                    onClick={() => {
                      if (selectedAvatar) setSelectedAvatar(undefined)
                      else
                        setValue('avatarUrl', '', {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                    }}
                  >
                    {selectedAvatar ? 'Bỏ ảnh đã chọn' : 'Xóa ảnh'}
                  </button>
                )}
              </div>
              {errors.avatarUrl && (
                <p role="alert" className="mt-1 text-xs text-rose-700">
                  {errors.avatarUrl.message}
                </p>
              )}
            </div>
            <input
              ref={avatarInput}
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (file)
                  setSelectedAvatar({ file, url: URL.createObjectURL(file) })
              }}
            />
          </div>
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
