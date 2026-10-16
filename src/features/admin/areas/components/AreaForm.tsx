import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { areaSchema, type Area } from '../schema'
import {
  Field,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
export function AreaForm({
  value,
  onSave,
  onClose,
}: {
  value: Area
  onSave: (v: Area) => string
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Area>({ resolver: zodResolver(areaSchema), defaultValues: value })
  return (
    <form
      className="space-y-4 p-6"
      onSubmit={handleSubmit((v) => {
        const error = onSave(v)
        if (error) setError('root', { message: error })
        else onClose()
      })}
    >
      <Field label="Mã khu vực" error={errors.code?.message}>
        <input className={fieldClass} {...register('code')} />
      </Field>
      <Field label="Tên khu vực" error={errors.name?.message}>
        <input className={fieldClass} {...register('name')} />
      </Field>
      <Field label="Mô tả" error={errors.description?.message}>
        <textarea className={fieldClass} {...register('description')} />
      </Field>
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
        <button className={primaryButton}>Lưu khu vực</button>
      </div>
    </form>
  )
}
