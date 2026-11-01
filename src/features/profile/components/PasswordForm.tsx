import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field } from '../../../components/Field/Field'
import { Icon } from '../../../components/Icon/Icon'
import { passwordSchema } from '../schemas/profileSchema'
import { profileError } from '../api/profileApi'
import type { PasswordValues, Profile } from '../types/types'
import { ProfileAccountCard } from './ProfileAccountCard'

export function PasswordForm({
  profile,
  onSave,
  busy,
}: {
  profile: Profile
  onSave: (values: PasswordValues) => Promise<void>
  busy: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')
  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (values) => {
        if (busy) return
        setError('')
        try {
          await onSave(values)
        } catch (e) {
          setError(profileError(e))
        }
      })}
    >
      <fieldset disabled={busy} className="contents">
        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
          <ProfileAccountCard profile={profile} />
          <div className="min-w-0 space-y-5">
            <h2 className="border-b border-slate-100 pb-4 font-semibold text-slate-800">
              Bảo mật tài khoản
            </h2>
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              Sau khi đổi mật khẩu, bạn cần đăng nhập lại.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {(
                [
                  {
                    name: 'currentPassword',
                    label: 'Mật khẩu hiện tại',
                    autocomplete: 'current-password',
                  },
                  {
                    name: 'newPassword',
                    label: 'Mật khẩu mới',
                    autocomplete: 'new-password',
                  },
                  {
                    name: 'confirmPassword',
                    label: 'Xác nhận mật khẩu mới',
                    autocomplete: 'new-password',
                  },
                ] as const
              ).map((field) => (
                <div
                  key={field.name}
                  className={
                    'relative ' +
                    (field.name === 'currentPassword' ? 'sm:col-span-2' : '')
                  }
                >
                  <Field
                    label={field.label}
                    error={errors[field.name]?.message}
                  >
                    <input
                      {...register(field.name)}
                      type={visible[field.name] ? 'text' : 'password'}
                      autoComplete={field.autocomplete}
                      className="min-h-12 w-full rounded-xl border border-slate-200 pl-3 pr-12 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </Field>
                  <button
                    type="button"
                    aria-label={
                      (visible[field.name] ? 'Ẩn ' : 'Hiện ') +
                      field.label.toLowerCase()
                    }
                    aria-pressed={!!visible[field.name]}
                    onClick={() =>
                      setVisible((old) => ({
                        ...old,
                        [field.name]: !old[field.name],
                      }))
                    }
                    className="absolute right-1 top-8 flex size-10 items-center justify-center rounded-lg text-slate-400 hover:text-emerald-700"
                  >
                    <Icon
                      name={visible[field.name] ? 'eye-off' : 'eye'}
                      size={19}
                    />
                  </button>
                </div>
              ))}
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
              >
                {error}
              </p>
            )}
            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={busy}
                className="min-h-11 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-40"
              >
                {busy ? 'Đang xử lý…' : 'Đổi mật khẩu'}
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  )
}
