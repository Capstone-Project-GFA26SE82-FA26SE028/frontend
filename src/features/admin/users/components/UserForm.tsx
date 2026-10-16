import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../../../../components/Modal/Modal'
import { userFormSchema, type UserFormValues } from '../schemas'
import {
  roles,
  roleLabels,
  type AdminUser,
  type AdminRestaurant,
} from '../types'
import {
  Field,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
export function UserForm({
  user,
  restaurants,
  onClose,
  onSave,
}: {
  user: AdminUser | null
  restaurants: AdminRestaurant[]
  onClose: () => void
  onSave: (values: UserFormValues) => string
}) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user ?? {
      name: '',
      email: '',
      phone: '',
      role: 'Manager',
      restaurantId: '',
    },
  })
  const role = useWatch({ control, name: 'role' })
  return (
    <Modal
      title={user ? 'Cập nhật tài khoản' : 'Thêm tài khoản'}
      onClose={onClose}
    >
      <form
        className="space-y-4 p-6"
        onSubmit={handleSubmit((values) => {
          const error = onSave({
            ...values,
            restaurantId: values.role === 'Admin' ? '' : values.restaurantId,
          })
          if (error) setError('root', { message: error })
        })}
      >
        <p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-500">
          Tạo hồ sơ người dùng trong bản dùng thử. Chưa cấp mật khẩu, gửi lời
          mời hay tạo phiên đăng nhập thật.
        </p>
        {(
          [
            ['name', 'Họ và tên'],
            ['email', 'Email'],
            ['phone', 'Số điện thoại'],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label} error={errors[key]?.message}>
            <input
              className={fieldClass}
              {...register(key)}
              type={
                key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'
              }
              aria-invalid={Boolean(errors[key])}
            />
          </Field>
        ))}
        <Field label="Vai trò" error={errors.role?.message}>
          <select {...register('role')} className={fieldClass}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
        </Field>
        {role !== 'Admin' && (
          <Field
            label="Nhà hàng phụ trách"
            error={errors.restaurantId?.message}
          >
            <select {...register('restaurantId')} className={fieldClass}>
              <option value="">Chọn nhà hàng</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {!r.active ? ' · Tạm dừng' : ''}
                </option>
              ))}
            </select>
          </Field>
        )}
        {errors.root && (
          <p role="alert" className="text-sm text-rose-600">
            {errors.root.message}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={secondaryButton}>
            Hủy
          </button>
          <button className={primaryButton}>
            {user ? 'Lưu thay đổi' : 'Tạo tài khoản'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
