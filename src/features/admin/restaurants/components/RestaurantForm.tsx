import { RestaurantHours } from './RestaurantHours'
import { Icon } from '../../../../components/Icon/Icon'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  restaurantSchema,
  type RestaurantValues,
} from '../schemas/restaurantSchema'
import type { Restaurant } from '../types'
import { restaurantError } from '../api/restaurantApi'
import {
  Field,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
export function RestaurantForm({
  restaurant,
  onSave,
  onCancel,
  pending,
}: {
  restaurant?: Restaurant
  onSave: (values: RestaurantValues) => Promise<unknown>
  onCancel: () => void
  pending: boolean
}) {
  const [failed, setFailed] = useState('')
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    clearErrors,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<RestaurantValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      restaurantName: restaurant?.restaurantName || '',
      address: restaurant?.address || '',
      hotline: restaurant?.hotline || '',
      taxCode: restaurant?.taxCode || '',
      logoUrl: restaurant?.logoUrl || '',
      timeZone: restaurant?.timeZone || 'Asia/Ho_Chi_Minh',
      openingHours:
        restaurant?.openingHours ??
        Array.from({ length: 7 }, (_, dayOfWeek) => ({
          dayOfWeek,
          openAt: '09:00',
          closeAt: '22:00',
        })),
    },
  })
  const logo = useWatch({ control, name: 'logoUrl' })
  const hours = useWatch({ control, name: 'openingHours' })
  return (
    <form
      className="p-5 sm:p-6"
      onSubmit={handleSubmit(async (values) => {
        clearErrors('root')
        try {
          await onSave(values)
        } catch (error) {
          setError('root', { message: restaurantError(error) })
        }
      })}
    >
      <fieldset
        disabled={pending || isSubmitting}
        className="min-w-0 space-y-6"
      >
        <div className="flex items-start gap-4 sm:gap-6">
          <div
            className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 sm:size-24"
            aria-label="Logo preview"
          >
            {logo && /^https?:\/\//i.test(logo) && logo !== failed ? (
              <img
                src={logo}
                alt="Restaurant logo"
                className="size-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setFailed(logo)}
              />
            ) : (
              <Icon name="store" size={30} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Field
              label="Restaurant name *"
              error={errors.restaurantName?.message}
            >
              <input
                className={fieldClass + ' !rounded-2xl !px-4 !py-3.5'}
                placeholder="Enter restaurant name"
                {...register('restaurantName')}
              />
            </Field>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {(
            [
              ['hotline', 'Phone *', 'Enter phone number'],
              ['taxCode', 'Tax code', 'Enter tax code'],
              ['address', 'Address *', 'Street, district, city'],
              [
                'logoUrl',
                'Logo URL',
                'https://example.com/restaurant-logo.jpg',
              ],
              ['timeZone', 'Time zone *', 'Asia/Ho_Chi_Minh'],
            ] as const
          ).map(([key, label, placeholder]) => (
            <div
              key={key}
              className={
                key === 'hotline' || key === 'taxCode' ? '' : 'sm:col-span-2'
              }
            >
              <Field label={label} error={errors[key]?.message}>
                <input
                  className={fieldClass + ' !rounded-2xl !px-4 !py-3.5'}
                  type={key === 'hotline' ? 'tel' : 'text'}
                  placeholder={placeholder}
                  {...register(key)}
                />
              </Field>
              {key === 'logoUrl' && (
                <p className="mt-2 text-xs text-slate-400">
                  Paste an image link to preview your restaurant logo.
                </p>
              )}
            </div>
          ))}
        </div>
        <RestaurantHours
          initialHours={hours}
          onChange={(value) =>
            setValue('openingHours', value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          error={
            errors.openingHours
              ? 'Enter valid opening and closing times. Closing time must be after opening time on the same day.'
              : undefined
          }
        />
        {errors.root && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
          >
            {errors.root.message}
          </p>
        )}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" className={secondaryButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={!!restaurant && !isDirty}
            className={primaryButton}
          >
            {pending
              ? 'Saving...'
              : restaurant
                ? 'Save changes'
                : 'Create restaurant'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
