import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
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
  onSaveAvatar,
  busy,
}: {
  profile: Profile
  onSave: (values: ProfileValues) => Promise<Profile>
  onSaveAvatar: (file: File) => Promise<string>
  busy: boolean
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName || '',
      phoneNumber: profile.phoneNumber || '',
    },
  })
  const [error, setError] = useState('')
  const avatarInput = useRef<HTMLInputElement>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<{
    file: File
    url: string
  }>()
  useEffect(() => {
    if (selectedAvatar) return () => URL.revokeObjectURL(selectedAvatar.url)
  }, [selectedAvatar])
  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (values) => {
        if (busy) return
        setError('')
        try {
          if (isDirty) {
            const saved = await onSave(values)
            reset({
              fullName: saved.fullName || '',
              phoneNumber: saved.phoneNumber || '',
            })
          }
          if (selectedAvatar) {
            await onSaveAvatar(selectedAvatar.file)
            setSelectedAvatar(undefined)
          }
        } catch (e) {
          setError(profileError(e))
        }
      })}
    >
      <fieldset disabled={busy} className="contents">
        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
          <ProfileAccountCard
            profile={profile}
            previewUrl={selectedAvatar?.url}
            onChangeAvatar={() => avatarInput.current?.click()}
            onClearPreview={() => setSelectedAvatar(undefined)}
          />
          <input
            ref={avatarInput}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file) return
              if (!file.size || file.size > 2 * 1024 * 1024) {
                setError('Chọn ảnh JPEG, PNG hoặc WebP tối đa 2 MiB.')
                return
              }
              setError('')
              setSelectedAvatar({ file, url: URL.createObjectURL(file) })
            }}
          />
          <div className="min-w-0 space-y-5">
            <h2 className="border-b border-slate-100 pb-4 font-semibold text-slate-800">
              Thông tin tài khoản
            </h2>
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
                disabled={(!isDirty && !selectedAvatar) || busy}
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
