import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
export function PaymentMethodCard({
  name,
  symbol,
  description,
  enabled,
  disabled = false,
  disabledReason,
  onChange,
}: {
  name: string
  symbol: string
  description: string
  enabled: boolean
  disabled?: boolean
  disabledReason?: string
  onChange: (enabled: boolean) => void
}) {
  return (
    <Panel
      className={
        'flex flex-col justify-between overflow-hidden ' +
        (enabled && !disabled ? 'ring-1 ring-emerald-200' : '') +
        (disabled ? ' opacity-80' : '')
      }
    >
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-bold text-emerald-700">
            {symbol}
          </span>
          <Badge tone={disabled ? 'slate' : enabled ? 'green' : 'slate'}>
            {disabled ? 'Chưa thể bật' : enabled ? 'Đang bật' : 'Đang tắt'}
          </Badge>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
          {description}
        </p>
        {disabled && disabledReason && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-800">
            ⚠️ {disabledReason}
          </p>
        )}
      </div>
      <label
        className={
          'flex min-h-16 items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6 ' +
          (disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer')
        }
      >
        <span className="text-sm font-medium text-slate-700">
          Cho phép thanh toán
          <span className="sr-only"> bằng {name}</span>
        </span>
        <span className="relative inline-flex shrink-0">
          <input
            type="checkbox"
            role="switch"
            disabled={disabled}
            checked={enabled && !disabled}
            onChange={(e) => {
              if (!disabled) {
                onChange(e.target.checked)
              }
            }}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 peer-focus-visible:ring-offset-2 peer-disabled:bg-slate-200"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"
          />
        </span>
      </label>
    </Panel>
  )
}
