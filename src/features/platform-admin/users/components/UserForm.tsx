import { useAccountRestaurants } from '../hooks/useUsers'
import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  restaurantSection,
  transferLocked = false,
}: {
  user: UserAccount | null
  roles: UserRole[]
  onClose: () => void
  onSave: (values: AccountFormValues, avatarFile?: File) => Promise<string>
  restaurantSection?: ReactNode
  transferLocked?: boolean
}) {
  const [tab, setTab] = useState<'account' | 'restaurant'>('account')
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema(!!user)),
    defaultValues: {
      restaurantId: user?.restaurantId || '',
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
  const role = useWatch({ control, name: 'role' })
  const canAssign = [
    'admin',
    'manager',
    'waiter',
    'cashier',
    'kitchen',
    'inventory',
  ].includes(role)
  const restaurants = useAccountRestaurants(!user && canAssign)
  const close = () => {
    if (!isSubmitting) onClose()
  }
  return (
    <Modal
      closeLabel="Đóng"
      title={user ? 'Sửa tài khoản' : 'Thêm tài khoản'}
      onClose={close}
    >
      {restaurantSection && (
        <div
          className="flex gap-5 border-b border-slate-100 px-6"
          role="tablist"
          aria-label="Sửa tài khoản"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'account'}
            aria-controls="user-account-panel"
            id="user-account-tab"
            disabled={isSubmitting}
            onClick={() => setTab('account')}
            className={`border-b-2 py-3 text-sm font-semibold ${tab === 'account' ? 'border-brand text-brand' : 'border-transparent text-slate-500'}`}
          >
            Thông tin tài khoản
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'restaurant'}
            aria-controls="user-restaurant-panel"
            id="user-restaurant-tab"
            disabled={isSubmitting}
            onClick={() => setTab('restaurant')}
            className={`border-b-2 py-3 text-sm font-semibold ${tab === 'restaurant' ? 'border-brand text-brand' : 'border-transparent text-slate-500'}`}
          >
            Chuyển nhà hàng
          </button>
        </div>
      )}
      <form
        id="user-account-panel"
        aria-labelledby={restaurantSection ? 'user-account-tab' : undefined}
        hidden={tab !== 'account'}
        noValidate
        className="space-y-4 p-6"
        onSubmit={handleSubmit(async (values) => {
          const error = await onSave(values, selectedAvatar?.file)
          if (error) setError('root', { message: error })
        })}
      >
        {transferLocked && (
          <p
            role="status"
            className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
          >
            Đang kiểm tra chuyển nhà hàng. Vui lòng đợi kết quả trước khi sửa
            tài khoản.
          </p>
        )}
        <fieldset
          disabled={isSubmitting || transferLocked}
          className="space-y-4"
        >
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
          {!user && canAssign && (
            <div>
              <Field
                label="Nhà hàng (không bắt buộc)"
                error={errors.restaurantId?.message}
              >
                <select
                  {...register('restaurantId')}
                  disabled={restaurants.isPending || restaurants.isError}
                  className="field"
                >
                  <option value="">Chưa gán nhà hàng</option>
                  {restaurants.data?.map((restaurant) => (
                    <option
                      key={restaurant.restaurantId}
                      value={restaurant.restaurantId}
                    >
                      {restaurant.restaurantName}
                    </option>
                  ))}
                </select>
              </Field>
              {restaurants.isPending && (
                <p role="status" className="mt-2 text-xs text-muted">
                  Đang tải nhà hàng…
                </p>
              )}
              {restaurants.isError && (
                <div role="alert" className="mt-2 text-sm text-amber-800">
                  Không tải được danh sách nhà hàng.{' '}
                  <button
                    type="button"
                    onClick={() => void restaurants.refetch()}
                    className="underline"
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </div>
          )}
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
            disabled={isSubmitting || transferLocked || !roles.length}
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
      {restaurantSection && (
        <section
          id="user-restaurant-panel"
          role="tabpanel"
          aria-labelledby="user-restaurant-tab"
          hidden={tab !== 'restaurant'}
          className="p-6"
        >
          {(isDirty || selectedAvatar) && (
            <p
              role="alert"
              className="mb-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800"
            >
              Thông tin tài khoản chưa được lưu. Lưu thay đổi rồi mở lại để
              chuyển nhà hàng.
            </p>
          )}
          <fieldset disabled={isDirty || !!selectedAvatar || isSubmitting}>
            {restaurantSection}
          </fieldset>
        </section>
      )}
    </Modal>
  )
}
