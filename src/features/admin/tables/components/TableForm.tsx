import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tableSchema, type RestaurantTable } from '../schema'
import type { Area } from '../../areas/schema'
import {
  Field,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
export function TableForm({
  value,
  areas,
  onSave,
  onClose,
}: {
  value: RestaurantTable
  areas: Area[]
  onSave: (v: RestaurantTable) => string
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RestaurantTable>({
    resolver: zodResolver(tableSchema),
    defaultValues: value,
  })
  return (
    <form
      className="space-y-4 p-6"
      onSubmit={handleSubmit((v) => {
        const error = onSave(v)
        if (error) setError('root', { message: error })
        else onClose()
      })}
    >
      <Field label="Mã bàn" error={errors.code?.message}>
        <input className={fieldClass} {...register('code')} />
      </Field>
      <Field label="Tên bàn" error={errors.name?.message}>
        <input className={fieldClass} {...register('name')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sức chứa (khách)" error={errors.capacity?.message}>
          <input
            type="number"
            className={fieldClass}
            {...register('capacity', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Khu vực">
          <select className={fieldClass} {...register('areaId')}>
            <option value="">Chưa phân khu vực</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id} disabled={!a.active}>
                {a.name}
                {!a.active ? ' (Ngừng sử dụng)' : ''}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Ghi chú" error={errors.note?.message}>
        <textarea className={fieldClass} {...register('note')} />
      </Field>
      {value.busy && (
        <p className="text-sm text-amber-700">
          Bàn đang phục vụ: không thể chuyển khu vực hoặc ngừng sử dụng.
        </p>
      )}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register('active')}
          className="size-4 accent-emerald-700"
        />
        Đang sử dụng
      </label>
      {errors.root && (
        <p role="alert" className="text-rose-600">
          {errors.root.message}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className={secondaryButton}>
          Hủy
        </button>
        <button className={primaryButton}>Lưu bàn</button>
      </div>
    </form>
  )
}
