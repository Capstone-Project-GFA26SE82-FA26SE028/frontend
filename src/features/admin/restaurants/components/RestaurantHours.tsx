import { useState } from 'react'
import { fieldClass } from '../../components/AdminUI'
import type { RestaurantValues } from '../schemas/restaurantSchema'
type Hours = RestaurantValues['openingHours']
type Schedule = { days: number[]; openAt: string; closeAt: string }
const days = [1, 2, 3, 4, 5, 6, 0]
const labels = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
export function RestaurantHours({
  initialHours,
  onChange,
  error,
}: {
  initialHours: Hours
  onChange: (hours: Hours) => void
  error?: string
}) {
  const [groups, setGroups] = useState<Schedule[]>(() => {
    const result: Schedule[] = []
    for (const hour of initialHours) {
      const group = result.find(
        (g) => g.openAt === hour.openAt && g.closeAt === hour.closeAt,
      )
      if (group) group.days.push(hour.dayOfWeek)
      else
        result.push({
          days: [hour.dayOfWeek],
          openAt: hour.openAt,
          closeAt: hour.closeAt,
        })
    }
    return result
  })
  function update(next: Schedule[]) {
    setGroups(next)
    onChange(
      next
        .flatMap((g) =>
          g.days.map((dayOfWeek) => ({
            dayOfWeek,
            openAt: g.openAt,
            closeAt: g.closeAt,
          })),
        )
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek),
    )
  }
  return (
    <section className="space-y-3 border-t border-slate-100 pt-4">
      <h3 className="font-semibold">Giờ mở cửa</h3>
      {groups.map((group, index) => (
        <fieldset
          key={index}
          className="min-w-0 space-y-3 rounded-2xl border border-slate-200 p-3"
        >
          <legend className="sr-only">Lịch {index + 1}</legend>
          <div className="flex flex-wrap items-center gap-1.5">
            {days.map((day) => {
              const selected = group.days.includes(day)
              const taken = groups.some(
                (g, i) => i !== index && g.days.includes(day),
              )
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={selected}
                  disabled={taken}
                  title={taken ? 'Đã chọn trong lịch khác' : labels[day]}
                  onClick={() =>
                    update(
                      groups.map((g, i) =>
                        i === index
                          ? {
                              ...g,
                              days: selected
                                ? g.days.filter((d) => d !== day)
                                : [...g.days, day],
                            }
                          : g,
                      ),
                    )
                  }
                  className={
                    'rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-30 ' +
                    (selected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50')
                  }
                >
                  {labels[day]}
                </button>
              )
            })}
            <button
              type="button"
              className="ml-auto px-2 py-2 text-xs text-rose-600 hover:bg-rose-50"
              aria-label={'Xóa lịch ' + (index + 1)}
              onClick={() => update(groups.filter((_, i) => i !== index))}
            >
              Xóa
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['openAt', 'closeAt'] as const).map((key) => (
              <label key={key} className="min-w-0 text-xs text-slate-500">
                {key === 'openAt' ? 'Giờ mở cửa' : 'Giờ đóng cửa'}
                <input
                  type="time"
                  required={group.days.length > 0}
                  className={fieldClass + ' mt-1'}
                  value={group[key]}
                  onChange={(e) =>
                    update(
                      groups.map((g, i) =>
                        i === index ? { ...g, [key]: e.target.value } : g,
                      ),
                    )
                  }
                />
              </label>
            ))}
          </div>
          {!group.days.length && (
            <p className="text-xs text-slate-500">
              Chọn ngày áp dụng cho lịch này.
            </p>
          )}
        </fieldset>
      ))}
      <button
        type="button"
        disabled={groups.length >= 7}
        className="rounded-lg px-2 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-40"
        onClick={() =>
          update([...groups, { days: [], openAt: '09:00', closeAt: '22:00' }])
        }
      >
        + Thêm lịch
      </button>
      <p className="text-xs text-slate-500">
        Mỗi ngày chỉ thuộc một lịch. Những ngày chưa chọn sẽ chưa được thiết
        lập.
      </p>
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </section>
  )
}
