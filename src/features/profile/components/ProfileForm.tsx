import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field } from '../../../components/Field/Field'
import { Icon } from '../../../components/Icon/Icon'
import { ProfileAccountCard } from './ProfileAccountCard'
import { profileSchema } from '../schemas/profileSchema'
import { profileError } from '../api/profileApi'
import type { Profile, ProfileValues } from '../types/types'

export function ProfileForm({
  profile,
  onSave,
  busy,
}: {
  profile: Profile
  onSave: (values: ProfileValues) => Promise<Profile>
  busy: boolean
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName || '',
      phoneNumber: profile.phoneNumber || '',
      avatarUrl: profile.avatarUrl || '',
    },
  })
  const [error, setError] = useState('')
  const [editingAvatar, setEditingAvatar] = useState(false)
  const avatar = useWatch({ control, name: 'avatarUrl' }).trim()
  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (values) => {
        if (busy) return
        setError('')
        try {
          const saved = await onSave(values)
          reset({
            fullName: saved.fullName || '',
            phoneNumber: saved.phoneNumber || '',
            avatarUrl: saved.avatarUrl || '',
          })
        } catch (e) {
          setError(profileError(e))
        }
      })}
    >
      <fieldset disabled={busy} className="contents">
        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
          <ProfileAccountCard
            profile={profile}
            avatarUrl={avatar}
            editingAvatar={editingAvatar}
            onChangeAvatar={() => setEditingAvatar(!editingAvatar)}
          />
          <div className="min-w-0 space-y-5">
            <h2 className="border-b border-slate-100 pb-4 font-semibold text-slate-800">
              Thông tin tài khoản
            </h2>
            {(editingAvatar || errors.avatarUrl) && (
              <Field
                label="Đường dẫn ảnh đại diện"
                error={errors.avatarUrl?.message}
              >
                <input
                  {...register('avatarUrl')}
                  type="url"
                  maxLength={2048}
                  placeholder="https://…"
                  className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </Field>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Họ và tên" error={errors.fullName?.message}>
                <input
                  {...register('fullName')}
                  autoComplete="name"
                  maxLength={255}
                  className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </Field>
              <Field label="Số điện thoại" error={errors.phoneNumber?.message}>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={20}
                  placeholder="Nhập số điện thoại"
                  className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tên đăng nhập">
                <input
                  value={profile.userName}
                  readOnly
                  className="min-h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 text-sm text-slate-500"
                />
              </Field>
              <Field label="Email">
                <input
                  value={profile.email}
                  readOnly
                  className="min-h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 text-sm text-slate-500"
                />
              </Field>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
              >
                {error}
              </p>
            )}
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="submit"
                disabled={!isDirty || busy}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-40"
              >
                <Icon name="check" size={17} />
                {busy ? 'Đang lưu…' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  )
}
