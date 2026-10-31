import { Icon } from '../Icon/Icon'

export function SummaryCards({
  items,
}: {
  items: { label: string; value: number | string; icon: string; note: string }[]
}) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white p-4"
        >
          <span
            className={`hidden size-11 shrink-0 items-center justify-center rounded-xl sm:flex ${['bg-emerald-50 text-emerald-700', 'bg-sky-50 text-sky-600', 'bg-amber-50 text-amber-600', 'bg-violet-50 text-violet-600'][i % 4]}`}
          >
            <Icon name={item.icon} size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p
              className={`mt-1 break-words font-bold tracking-tight text-[#16382e] ${typeof item.value === 'string' ? 'text-lg sm:text-xl 2xl:text-2xl' : 'text-3xl'}`}
            >
              {item.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{item.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
