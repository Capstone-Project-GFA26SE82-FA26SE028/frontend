import { useState } from 'react'
import { Icon } from '../../../components/Icon/Icon'
import { useProfile } from '../hooks/useProfile'
import { ProfileForm } from '../components/ProfileForm'
import { PasswordForm } from '../components/PasswordForm'
import { profileError } from '../api/profileApi'

export function ProfilePage() {
  const [tab, setTab] = useState<'information' | 'password'>('information')
  const { profile, save, password } = useProfile()
  const busy = save.isPending || password.isPending
  return (
    <div className="w-full">
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
      <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-200/20">
        <nav
          aria-label="Cài đặt hồ sơ"
          className="flex gap-5 border-b border-slate-100 px-5 sm:gap-7 sm:px-6"
        >
          {(
            [
              { id: 'information', label: 'Thông tin cá nhân', icon: 'users' },
              { id: 'password', label: 'Đổi mật khẩu', icon: 'shield' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={tab === item.id ? 'page' : undefined}
              disabled={busy}
              onClick={() => setTab(item.id)}
              className={
                'flex min-h-14 items-center gap-2 border-b-2 px-1 text-sm font-medium disabled:opacity-40 ' +
                (tab === item.id
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700')
              }
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-5 sm:p-6">
          {profile.isPending ? (
            <p
              role="status"
              className="py-10 text-center text-sm text-slate-500"
            >
              Đang tải hồ sơ…
            </p>
          ) : profile.isError ? (
            <div role="alert" className="space-y-4 text-sm text-rose-700">
              <p>{profileError(profile.error)}</p>
              <button
                type="button"
                onClick={() => void profile.refetch()}
                className="rounded-lg border border-rose-100 px-4 py-2"
              >
                Thử lại
              </button>
            </div>
          ) : tab === 'information' ? (
            <ProfileForm
              key={profile.data.userId}
              profile={profile.data}
              onSave={(values) => save.mutateAsync(values)}
              busy={save.isPending}
            />
          ) : (
            <PasswordForm
              profile={profile.data}
              onSave={(values) => password.mutateAsync(values)}
              busy={password.isPending}
            />
          )}
        </div>
      </section>
    </div>
  )
}
