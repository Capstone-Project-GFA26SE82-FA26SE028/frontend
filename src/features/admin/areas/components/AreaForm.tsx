import { Icon } from '../../../../components/Icon/Icon'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { areaSchema, type AreaValues } from '../schemas/areaSchema'
import type { Area } from '../types/types'
import type { Restaurant } from '../../restaurants/types/types'
import {
  Field,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
import { areaError } from '../api/areaApi'
export function AreaForm({
  area,
  restaurants,
  restaurantId,
  pending,
  onSave,
  onClose,
}: {
  area?: Area
  restaurants: Restaurant[]
  restaurantId: string
  pending: boolean
  onSave: (values: AreaValues) => Promise<unknown>
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AreaValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: area
      ? {
          restaurantId: area.restaurantId,
          areaCode: area.areaCode,
          areaName: area.areaName,
          serviceType: area.serviceType,
          spaceType: area.spaceType,
        }
      : {
          restaurantId,
          areaCode: '',
          areaName: '',
          serviceType: '',
          spaceType: '',
        },
  })
  return (
    <form
      className="space-y-5 p-5 sm:p-6"
      onSubmit={handleSubmit(async (values) => {
        clearErrors('root')
        try {
          await onSave(values)
        } catch (error) {
          setError('root', { message: areaError(error) })
        }
      })}
    >
      <fieldset
        disabled={pending || isSubmitting}
        className="min-w-0 space-y-5"
      >
        {area && <input type="hidden" {...register('restaurantId')} />}
        <div className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
              <Icon name="grid" size={21} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                {area ? 'Cập nhật khu vực' : 'Khu vực phục vụ mới'}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {area
                  ? 'Cập nhật thông tin khu vực.'
                  : 'Chọn nhà hàng cho khu vực này.'}
              </p>
            </div>
          </div>
          <Field label="Nhà hàng *" error={errors.restaurantId?.message}>
            {area ? (
              <input
                className={fieldClass + ' bg-slate-50'}
                readOnly
                value={
                  restaurants.find((r) => r.restaurantId === area.restaurantId)
                    ?.restaurantName || 'Chưa có thông tin nhà hàng'
                }
              />
            ) : (
              <select className={fieldClass} {...register('restaurantId')}>
                <option value="">Chọn nhà hàng</option>
                {restaurants.map((r) => (
                  <option key={r.restaurantId} value={r.restaurantId}>
                    {r.restaurantName}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
        <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2 sm:p-5">
          {(
            [
              ['areaCode', 'Mã khu vực *', 'Ví dụ: TANGTRET-01'],
              ['areaName', 'Tên khu vực *', 'Ví dụ: Tầng trệt'],
              ['serviceType', 'Loại phục vụ *', 'Ví dụ: Buffet'],
              ['spaceType', 'Loại không gian *', 'Ví dụ: Trong nhà'],
            ] as const
          ).map(([key, label, placeholder]) => (
            <Field key={key} label={label} error={errors[key]?.message}>
              <input
                className={fieldClass + ' bg-white'}
                placeholder={placeholder}
                maxLength={key === 'areaName' ? 100 : 50}
                {...register(key)}
              />
            </Field>
          ))}
        </div>
        {errors.root && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
          >
            {errors.root.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            className={secondaryButton + ' justify-center'}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className={primaryButton + ' justify-center'}
            disabled={!!area && !isDirty}
          >
            {pending ? 'Đang lưu…' : area ? 'Lưu thay đổi' : 'Tạo khu vực'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
