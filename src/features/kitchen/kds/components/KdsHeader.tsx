import { Icon } from '../../../../components/Icon/Icon'
import { clock } from '../utils/format'

export function KdsHeader({
  now,
  focus,
  onToggleFocus,
}: {
  now: number
  focus: boolean
  onToggleFocus: () => void
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      {/* Ngày tháng tiếng Việt */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="flex size-2 rounded-full bg-emerald-500" />
        <span>
          {new Date(now).toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Đồng hồ thời gian thực & Nút chuyển Focus Mode */}
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 shadow-2xs">
          <Icon name="clock" size={14} className="text-emerald-700" />
          <strong className="text-base font-black tabular-nums tracking-tight text-slate-900">
            {clock(now)}
          </strong>
        </div>

        <button
          type="button"
          onClick={onToggleFocus}
          aria-pressed={focus}
          className={`flex min-h-9 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
            focus
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
              : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Icon name={focus ? 'close' : 'monitor'} size={15} />
          <span>{focus ? 'Thoát toàn màn hình' : 'Toàn màn hình'}</span>
        </button>
      </div>
    </div>
  )
}
