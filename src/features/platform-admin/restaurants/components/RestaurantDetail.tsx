import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import type { Restaurant } from '../types/types'

const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']
function formatDays(indices: number[]) {
  if (indices.length === 7) return 'Hằng ngày'
  const parts: string[] = []
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i]
    let end = start
    while (i + 1 < indices.length && indices[i + 1] === end + 1)
      end = indices[++i]
    parts.push(
      start === end ? dayNames[start] : dayNames[start] + '-' + dayNames[end],
    )
  }
  return parts.join(', ')
}
export function RestaurantDetail({
  restaurant,
  onEdit,
  onClose,
}: {
  restaurant: Restaurant
  onEdit: () => void
  onClose: () => void
}) {
  const [failed, setFailed] = useState(false)
  const schedules: { days: number[]; time: string }[] = []
  for (let index = 0; index < 7; index++) {
    const hour = restaurant.openingHours.find(
      (h) => h.dayOfWeek === (index + 1) % 7,
    )
    const time = hour ? hour.openAt + ' - ' + hour.closeAt : 'Chưa thiết lập'
    const group = schedules.find((schedule) => schedule.time === time)
    if (group) group.days.push(index)
    else schedules.push({ days: [index], time })
  }
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <div className="flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-200 sm:h-56">
        {restaurant.logoUrl &&
        /^https?:\/\//i.test(restaurant.logoUrl) &&
        !failed ? (
          <img
            src={restaurant.logoUrl}
            alt={restaurant.restaurantName}
            className="size-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex size-24 items-center justify-center rounded-3xl border border-white/70 bg-white/60 text-emerald-700">
            <Icon name="store" size={48} />
          </div>
        )}
      </div>
      <dl className="space-y-4 rounded-2xl bg-slate-50 p-5">
        {[
          ['Số điện thoại', restaurant.hotline],
          ['Mã số thuế', restaurant.taxCode],
          ['Múi giờ', restaurant.timeZone],
          ['Địa chỉ', restaurant.address],
        ].map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 text-sm sm:grid-cols-[8rem_minmax(0,1fr)]"
          >
            <dt className="text-slate-500">{label}</dt>
            <dd className="break-words text-right font-medium text-slate-700">
              {value || 'Chưa cung cấp'}
            </dd>
          </div>
        ))}
      </dl>
      <section className="rounded-2xl bg-slate-50 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Icon name="clock" size={18} />
          Giờ mở cửa
        </h3>
        <dl className="divide-y divide-slate-200/60 border-t border-slate-200/60">
          {schedules.map((schedule) => (
            <div
              key={schedule.time}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm"
            >
              <dt className="text-slate-500">{formatDays(schedule.days)}</dt>
              <dd className="ml-auto whitespace-nowrap font-semibold tabular-nums text-slate-700">
                {schedule.time}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="grid grid-cols-2 gap-3">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40 justify-center"
          onClick={onEdit}
        >
          <Icon name="edit" size={18} />
          Sửa
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 justify-center bg-slate-50"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
