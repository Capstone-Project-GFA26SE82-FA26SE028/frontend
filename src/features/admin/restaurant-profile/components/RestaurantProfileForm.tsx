import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type Profile } from '../schema'
import {
  Panel,
  Field,
  Notice,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
export function RestaurantProfileForm({
  profile,
  onSave,
}: {
  profile: Profile
  onSave: (value: Profile) => string
}) {
  const [notice, setNotice] = useState('')
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  })
  const logo = useWatch({ control, name: 'logo' })
  const name = useWatch({ control, name: 'name' })
  return (
    <>
      {notice && <Notice>{notice}</Notice>}
      <form
        onSubmit={handleSubmit((v) => {
          setNotice('')
          const error = onSave(v)
          if (error) setError('root', { message: error })
          else {
            reset(v)
            setNotice('Đã lưu thông tin nhà hàng.')
          }
        })}
        className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]"
      >
        <Panel className="space-y-5 p-5 sm:p-6">
          <div className="mx-auto flex size-28 items-center justify-center overflow-hidden rounded-3xl bg-emerald-50 text-3xl font-bold text-emerald-800">
            {logo ? (
              <img
                src={logo}
                alt="Logo nhà hàng"
                className="size-full object-cover"
              />
            ) : (
              (name.trim()[0] || 'M').toUpperCase()
            )}
          </div>
          <div>
            <h2 className="break-words text-center text-xl font-semibold text-slate-900">
              {name || 'Tên nhà hàng'}
            </h2>
            <p className="mt-1 text-center text-sm text-slate-500">
              Nhận diện nhà hàng
            </p>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              PNG, JPG hoặc WebP, tối đa 1 MB.
            </p>
          </div>
          <Field label="Chọn ảnh" error={errors.logo?.message}>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="w-full min-w-0 text-xs text-slate-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-3 file:text-sm file:font-semibold file:text-emerald-800 hover:file:bg-emerald-100"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                if (
                  !['image/png', 'image/jpeg', 'image/webp'].includes(f.type) ||
                  f.size > 1024 * 1024
                ) {
                  setError('logo', {
                    message: 'Chọn ảnh PNG, JPG hoặc WebP tối đa 1 MB.',
                  })
                  return
                }
                const reader = new FileReader()
                reader.onload = () =>
                  setValue('logo', String(reader.result), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                reader.onerror = () =>
                  setError('logo', { message: 'Không đọc được ảnh.' })
                reader.readAsDataURL(f)
              }}
            />
          </Field>
          {logo && (
            <button
              type="button"
              className={secondaryButton}
              onClick={() =>
                setValue('logo', '', {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              Gỡ ảnh
            </button>
          )}
        </Panel>
        <Panel className="p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Hồ sơ nhà hàng
            </h2>
            <p className="text-xs text-slate-500">
              <span className="text-rose-500">*</span> Thông tin bắt buộc
            </p>
          </div>
          <div className="space-y-7">
            {(
              [
                {
                  title: 'Thông tin chung',
                  description: 'Tên và thông tin đăng ký của nhà hàng.',
                  fields: [
                    ['name', 'Tên nhà hàng'],
                    ['taxCode', 'Mã số thuế'],
                  ],
                },
                {
                  title: 'Liên hệ',
                  description: 'Thông tin để khách hàng liên hệ và tìm đến.',
                  fields: [
                    ['phone', 'Số điện thoại'],
                    ['email', 'Email'],
                    ['address', 'Địa chỉ'],
                  ],
                },
                {
                  title: 'Giờ hoạt động',
                  description: 'Khung giờ mở cửa và đóng cửa trong cùng ngày.',
                  fields: [
                    ['opening', 'Giờ mở cửa'],
                    ['closing', 'Giờ đóng cửa'],
                  ],
                },
              ] as const
            ).map((group, index) => (
              <fieldset
                key={group.title}
                className={index ? 'border-t border-slate-100 pt-6' : ''}
              >
                <legend className="sr-only">{group.title}</legend>
                <h3 className="font-semibold text-slate-800">{group.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {group.description}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {group.fields.map(([key, label]) => {
                    const required = key !== 'email' && key !== 'taxCode'
                    return (
                      <div
                        key={key}
                        className={key === 'address' ? 'sm:col-span-2' : ''}
                      >
                        <Field
                          label={label + (required ? ' *' : '')}
                          error={errors[key]?.message}
                        >
                          <input
                            aria-required={required}
                            className={fieldClass}
                            type={
                              key === 'opening' || key === 'closing'
                                ? 'time'
                                : key === 'email'
                                  ? 'email'
                                  : key === 'phone'
                                    ? 'tel'
                                    : 'text'
                            }
                            autoComplete={
                              key === 'email'
                                ? 'email'
                                : key === 'phone'
                                  ? 'tel'
                                  : key === 'address'
                                    ? 'street-address'
                                    : key === 'name'
                                      ? 'organization'
                                      : undefined
                            }
                            {...register(key)}
                          />
                        </Field>
                      </div>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          {errors.root && (
            <p role="alert" className="mt-4 text-rose-600">
              {errors.root.message}
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              className={secondaryButton}
              onClick={() => {
                reset(profile)
                setNotice('')
              }}
            >
              Hủy thay đổi
            </button>
            <span role="status" className="mr-auto text-xs text-slate-500">
              {isDirty ? 'Có thay đổi chưa lưu' : 'Thông tin đã được lưu'}
            </span>
            <button disabled={!isDirty} className={primaryButton}>
              Lưu thay đổi
            </button>
          </div>
        </Panel>
      </form>
    </>
  )
}
