import { useState } from 'react'
import { Icon } from '../../../components/Icon/Icon'
import { Badge } from '../../../components/Badge/Badge'
import type { Profile } from '../types/types'

function profileDate(value: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return 'Chưa có thông tin'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ProfileAccountCard({
  profile,
  avatarUrl,
  editingAvatar = false,
  onChangeAvatar,
}: {
  profile: Profile
  avatarUrl?: string
  editingAvatar?: boolean
  onChangeAvatar?: () => void
}) {
  const [failedUrl, setFailedUrl] = useState('')
  const avatar = (avatarUrl ?? profile.avatarUrl ?? '').trim()
  return (
    <div className="flex min-w-0 flex-col items-center rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white px-5 py-6 text-center">
      <span className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-3xl font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
        {avatar && /^https?:\/\//i.test(avatar) && avatar !== failedUrl ? (
          <img
            src={avatar}
            alt="Ảnh đại diện"
            referrerPolicy="no-referrer"
            className="size-full object-cover"
            onError={() => setFailedUrl(avatar)}
          />
        ) : (
          (profile.fullName || profile.userName).slice(0, 1).toUpperCase()
        )}
      </span>
      <div className="mt-4 w-full min-w-0">
        <p className="break-words text-lg font-semibold text-slate-800">
          {profile.fullName || profile.userName}
        </p>
        <p className="mt-1 truncate text-xs text-slate-400">
          @{profile.userName}
        </p>
        {onChangeAvatar && (
          <button
            type="button"
            aria-expanded={editingAvatar}
            onClick={onChangeAvatar}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            <Icon name="edit" size={13} />
            {editingAvatar ? 'Thu gọn' : 'Thay ảnh'}
          </button>
        )}
      </div>
      <div className="mt-4">
        <Badge tone={profile.isActive ? 'green' : 'slate'}>
          {profile.isActive ? 'Hoạt động' : 'Bị khóa'}
        </Badge>
      </div>
      <dl className="mt-5 w-full space-y-4 border-t border-emerald-100 pt-5 text-left text-sm">
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-slate-500">Vai trò</dt>
          <dd className="font-medium text-emerald-800">
            {profile.roleId === 'admin' ? 'Quản trị viên' : profile.roleId}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Ngày tạo tài khoản</dt>
          <dd className="mt-1 font-medium text-slate-700">
            {profileDate(profile.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Cập nhật gần nhất</dt>
          <dd className="mt-1 font-medium text-slate-700">
            {profileDate(profile.updatedAt)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
