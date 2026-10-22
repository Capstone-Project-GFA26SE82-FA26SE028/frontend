import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { areaSchema, type AreaValues } from '../schemas/areaSchema'
import type { Area } from '../types'
import type { Restaurant } from '../../restaurants/types'
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
      className="space-y-5 p-6"
      onSubmit={handleSubmit(async (values) => {
        clearErrors('root')
        try {
          await onSave(values)
        } catch (error) {
          setError('root', { message: areaError(error) })
        }
      })}
    >
      <fieldset disabled={pending || isSubmitting} className="space-y-5">
        {area && <input type="hidden" {...register('restaurantId')} />}
        <Field label="Restaurant *" error={errors.restaurantId?.message}>
          {area ? (
            <input
              className={fieldClass + ' bg-slate-50'}
              readOnly
              value={
                restaurants.find((r) => r.restaurantId === area.restaurantId)
                  ?.restaurantName || 'Restaurant unavailable'
              }
            />
          ) : (
            <select className={fieldClass} {...register('restaurantId')}>
              <option value="">Select restaurant</option>
              {restaurants.map((r) => (
                <option key={r.restaurantId} value={r.restaurantId}>
                  {r.restaurantName}
                </option>
              ))}
            </select>
          )}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ['areaCode', 'Area code *'],
              ['areaName', 'Area name *'],
              ['serviceType', 'Service type *'],
              ['spaceType', 'Space type *'],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label} error={errors[key]?.message}>
              <input className={fieldClass} {...register(key)} />
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
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" className={secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button className={primaryButton} disabled={!!area && !isDirty}>
            {pending ? 'Saving...' : area ? 'Save changes' : 'Create area'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
