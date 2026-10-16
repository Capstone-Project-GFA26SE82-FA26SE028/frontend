import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  roleAssignmentSchema,
  type RoleAssignmentValues,
} from '../schemas/roleAssignmentSchema'
import { Modal } from '../../../../components/Modal/Modal'
import {
  roles,
  roleLabels,
  type AdminUser,
  type AdminRestaurant,
} from '../../users/types'
import {
  Field,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
import { roleDescriptions } from '../data'

export function RoleAssignmentModal({
  user,
  restaurants,
  onClose,
  onSave,
}: {
  user: AdminUser
  restaurants: AdminRestaurant[]
  onClose: () => void
  onSave: (value: RoleAssignmentValues) => string
}) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RoleAssignmentValues>({
    resolver: zodResolver(roleAssignmentSchema),
    defaultValues: {
      role: user.role,
      restaurantId: user.restaurantId,
      reason: '',
    },
  })
  const role = useWatch({ control, name: 'role' })
  return (
    <Modal title="Đổi vai trò" onClose={onClose}>
      <form
        className="space-y-4 p-6"
        onSubmit={handleSubmit((v) => {
          const message = onSave({
            ...v,
            restaurantId: v.role === 'Admin' ? '' : v.restaurantId,
          })
          if (message) setError('root', { message })
        })}
      >
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="mt-1 break-words text-sm text-slate-500">
            {user.email}
          </p>
        </div>
        <Field label="Vai trò" error={errors.role?.message}>
          <select className={fieldClass} {...register('role')}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
        </Field>
        <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          Phạm vi dự kiến: {roleDescriptions[role].scope}. Thay đổi này chỉ cập
          nhật hồ sơ mẫu.
        </p>
        {role !== 'Admin' && (
          <Field
            label="Nhà hàng phụ trách"
            error={errors.restaurantId?.message}
          >
            <select className={fieldClass} {...register('restaurantId')}>
              <option value="">Chọn nhà hàng</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {r.active ? '' : ' · Tạm dừng'}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Lý do thay đổi" error={errors.reason?.message}>
          <textarea
            className={fieldClass}
            rows={3}
            maxLength={500}
            {...register('reason')}
          />
        </Field>
        {errors.root && (
          <p role="alert" className="text-sm text-rose-600">
            {errors.root.message}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className={secondaryButton} onClick={onClose}>
            Hủy
          </button>
          <button className={primaryButton}>Lưu phân công</button>
        </div>
      </form>
    </Modal>
  )
}
