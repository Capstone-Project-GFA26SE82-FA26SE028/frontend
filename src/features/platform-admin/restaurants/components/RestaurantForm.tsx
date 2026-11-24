import { RestaurantHours } from './RestaurantHours'
import { Icon } from '../../../../components/Icon/Icon'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  restaurantSchema,
  type RestaurantValues,
} from '../schemas/restaurantSchema'
import type { Restaurant } from '../types/types'
import { restaurantError } from '../api/restaurantApi'

import { Field } from '../../../../components/Field/Field'
export function RestaurantForm({
  restaurant,
  onSave,
  onCancel,
  pending,
}: {
  restaurant?: Restaurant
  onSave: (values: RestaurantValues, logoFile?: File) => Promise<unknown>
  onCancel: () => void
  pending: boolean
}) {
  const [failed, setFailed] = useState('')
  const logoInput = useRef<HTMLInputElement>(null)
  const [selectedLogo, setSelectedLogo] = useState<{
    file: File
    url: string
  }>()
  useEffect(() => {
    if (selectedLogo) return () => URL.revokeObjectURL(selectedLogo.url)
  }, [selectedLogo])
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
  const logo = selectedLogo?.url || restaurant?.logoUrl
  const hours = useWatch({ control, name: 'openingHours' })
  return (
    <form
      className="p-5 sm:p-6"
      onSubmit={handleSubmit(async (values) => {
        clearErrors('root')
        try {
          await onSave(values, selectedLogo?.file)
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
            aria-label="Xem trước logo"
          >
            {logo &&
            (selectedLogo || /^https?:\/\//i.test(logo)) &&
            logo !== failed ? (
              <img
                src={logo}
                alt="Logo nhà hàng"
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
              label="Tên nhà hàng *"
              error={errors.restaurantName?.message}
            >
              <input
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 !rounded-2xl !px-4 !py-3.5"
                placeholder="Nhập tên nhà hàng"
                {...register('restaurantName')}
              />
            </Field>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <button
                type="button"
                onClick={() => logoInput.current?.click()}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                <Icon name="edit" size={14} />
                {logo ? 'Đổi logo' : 'Chọn logo'}
              </button>
              {selectedLogo && (
                <button
                  type="button"
                  onClick={() => setSelectedLogo(undefined)}
                  className="min-h-9 text-xs font-medium text-rose-700"
                >
                  Bỏ ảnh đã chọn
                </button>
              )}
              <input
                ref={logoInput}
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ''
                  if (file)
                    setSelectedLogo({ file, url: URL.createObjectURL(file) })
                }}
              />
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">
              {selectedLogo?.file.name || 'JPG, PNG hoặc WebP · Tối đa 2 MiB'}
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {(
            [
              ['hotline', 'Số điện thoại *', 'Nhập số điện thoại'],
              ['taxCode', 'Mã số thuế', 'Nhập mã số thuế'],
              [
                'address',
                'Địa chỉ *',
                'Số nhà, đường, quận/huyện, tỉnh/thành phố',
              ],
              ['timeZone', 'Múi giờ *', 'Asia/Ho_Chi_Minh'],
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
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 !rounded-2xl !px-4 !py-3.5"
                  type={key === 'hotline' ? 'tel' : 'text'}
                  placeholder={placeholder}
                  {...register(key)}
                />
              </Field>
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
              ? 'Nhập giờ mở và đóng cửa hợp lệ. Giờ đóng cửa phải sau giờ mở cửa trong cùng ngày.'
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
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!!restaurant && !isDirty && !selectedLogo}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
          >
            {pending
              ? 'Đang lưu…'
              : restaurant
                ? 'Lưu thay đổi'
                : 'Tạo nhà hàng'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
