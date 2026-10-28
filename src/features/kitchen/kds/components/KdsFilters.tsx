import { Icon } from '../../../../components/Icon/Icon'
import type { Ticket } from '../types'

type Props = {
  query: string
  setQuery: (value: string) => void
  filter: string
  setFilter: (value: string) => void
  sort: string
  setSort: (value: string) => void
  active: Ticket[]
}

export function KdsFilters({
  query,
  setQuery,
  filter,
  setFilter,
  sort,
  setSort,
  active,
}: Props) {
  return (
    <div className="mb-[22px] flex flex-col items-stretch justify-between gap-3 md:flex-row md:flex-wrap md:items-center">
      <div
        className="flex justify-between gap-1 rounded-[10px] bg-[#e7eeea] p-1 md:justify-normal [&_button>span]:rounded-[5px] [&_button>span]:bg-[#eaf0ec] [&_button>span]:px-[5px] [&_button>span]:py-px [&_button>span]:text-sm"
        role="group"
        aria-label="Filter tickets"
      >
        {['All', 'VIP priority', 'Long wait'].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            className={`flex min-h-12 items-center justify-center gap-1.5 rounded-[7px] px-2.5 py-2 text-sm whitespace-nowrap md:px-3 ${filter === f ? 'bg-white font-[650] text-[#254d3b] shadow-[0_2px_5px_#103f3209]' : 'text-[#475569]'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'VIP priority' && <Icon name="crown" size={15} />} {f}
            {f === 'All' && (
              <span>{new Set(active.map((t) => t.order)).size} orders</span>
            )}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 md:flex md:flex-wrap md:items-center [&>select]:rounded-[9px] [&>select]:border [&>select]:border-[#dfe8e1] [&>select]:bg-white [&>select]:px-[9px] [&>select]:py-[11px] [&>select]:text-base [&>select]:text-[#334155]">
        <label className="flex items-center gap-2 rounded-[9px] border border-[#dfe8e1] bg-white p-2.5 text-[#64748b] md:px-3 [&>input]:min-w-0 [&>input]:w-full [&>input]:bg-transparent [&>input]:text-base [&>input]:text-[#234638] [&>input]:outline-none md:[&>input]:w-64">
          <Icon name="search" size={17} />
          <input
            aria-label="Search KDS"
            placeholder="Search order IDs or dishes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="KDS sort order"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option>By arrival time</option>
          <option>VIP first</option>
        </select>
      </div>
    </div>
  )
}
