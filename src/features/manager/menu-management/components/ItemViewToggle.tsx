import { Icon } from '../../../../components/Icon/Icon'
import type { ItemViewMode } from '../types/catalog'

export function ItemViewToggle({
  view,
  onChange,
}: {
  view: ItemViewMode
  onChange: (view: ItemViewMode) => void
}) {
  return (
    <div
      role="group"
      aria-label="Menu item view"
      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 sm:ml-auto"
    >
      {(['card', 'list'] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          aria-pressed={view === mode}
          onClick={() => onChange(mode)}
          className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors ${view === mode ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-emerald-800'}`}
        >
          <Icon name={mode === 'card' ? 'grid' : 'menu'} size={18} />
          {mode === 'card' ? 'Card' : 'List'}
        </button>
      ))}
    </div>
  )
}
