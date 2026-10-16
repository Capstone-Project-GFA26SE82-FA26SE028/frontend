import { Field, fieldClass, secondaryButton } from '../../components/AdminUI'
import { localDay } from '../utils'
import type { ActivityDateRange } from '../utils'

export function ActivityDateFilter({
  range,
  onChange,
}: {
  range: ActivityDateRange
  onChange: (range: ActivityDateRange) => void
}) {
  const invalid = Boolean(range.from && range.to && range.from > range.to)
  return (
    <div className="mb-5 rounded-2xl border border-slate-200/70 bg-white p-4">
      <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto_auto]">
        <Field label="Từ ngày">
          <input
            type="date"
            className={`${fieldClass} min-w-0`}
            value={range.from}
            onChange={(e) => onChange({ ...range, from: e.target.value })}
          />
        </Field>
        <Field
          label="Đến ngày"
          error={
            invalid ? 'Ngày kết thúc không được trước ngày bắt đầu.' : undefined
          }
        >
          <input
            type="date"
            className={`${fieldClass} min-w-0`}
            value={range.to}
            onChange={(e) => onChange({ ...range, to: e.target.value })}
          />
        </Field>
        <button
          className={secondaryButton}
          onClick={() => {
            const now = new Date()
            onChange({
              from: localDay(new Date(now.getFullYear(), now.getMonth(), 1)),
              to: localDay(now),
            })
          }}
        >
          Tháng này
        </button>
        <button
          className={secondaryButton}
          onClick={() => onChange({ from: '', to: '' })}
        >
          Toàn bộ thời gian
        </button>
      </div>
    </div>
  )
}
