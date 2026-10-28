import { Icon } from '../../../../components/Icon/Icon'
import { kdsColumns, kdsToneStyles } from '../constants'
import type { Ticket, KdsOrder } from '../types'

export function KdsOverview({
  area,
  orders,
  active,
  late,
}: {
  area: string
  orders: KdsOrder[]
  active: Ticket[]
  late: (ticket: Ticket) => boolean
}) {
  return (
    <div className="relative mb-6 flex min-h-28 flex-col items-stretch gap-[18px] overflow-hidden rounded-[14px] bg-[#103f32] p-[18px] text-white shadow-[0_6px_20px_#103f3210] md:flex-row md:items-center md:gap-[22px] md:p-6 after:pointer-events-none after:absolute after:-top-[65px] after:-right-[55px] after:size-[190px] after:rounded-full after:border-[30px] after:border-[#ffffff03] after:content-['']">
      <div className="flex min-w-0 items-center gap-3.5 md:min-w-[185px] [&>div:last-child]:grid [&>div:last-child]:gap-1 [&_span]:text-sm [&_span]:font-medium [&_span]:text-emerald-100 [&_strong]:text-[22px] [&_strong]:font-bold [&_small]:text-sm [&_small]:text-emerald-100">
        <div className="grid size-[47px] place-items-center rounded-[13px] border border-[#ffffff17] bg-[#ffffff0c] text-[#bfd9a6]">
          <Icon name={area === 'Bar' ? 'cup' : 'fire'} size={25} />
        </div>
        <div>
          <span>CURRENT STATION</span>
          <strong>{area}</strong>
          <small>Kitchen staff</small>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 items-center gap-5 border-t border-white/20 pt-4 md:grid-cols-4 md:border-t-0 md:border-l md:pt-0 md:pl-6 [&>div]:grid [&>div]:grid-cols-[8px_auto] [&>div]:items-center [&>div]:gap-x-2 [&>div]:gap-y-1 [&_strong]:text-4xl [&_strong]:leading-tight [&_strong]:font-bold [&_strong]:tabular-nums [&_small]:col-start-2 [&_small]:text-sm [&_small]:font-medium [&_small]:text-emerald-50">
        {kdsColumns.map((c) => (
          <div key={c.status}>
            <span
              className={`size-[5px] rounded-full ${kdsToneStyles[c.tone].dot}`}
            />
            <strong>
              {String(
                orders.filter((t) => t.status === c.status).length,
              ).padStart(2, '0')}
            </strong>
            <small>{c.title}</small>
          </div>
        ))}
      </div>
      <div className="hidden max-w-60 items-center gap-2.5 border-l border-[#ffffff15] pl-[23px] text-[#e8bc80] min-[1251px]:flex [&>div]:grid [&>div]:gap-[5px] [&_strong]:text-sm [&_strong]:font-[550] [&_span]:text-sm [&_span]:leading-normal [&_span]:text-[#9cb6a9]">
        <Icon name="clock" size={20} />
        <div>
          <strong>
            {active.filter(late).length
              ? `${active.filter(late).length} dish lines waiting too long`
              : 'Queue under control'}
          </strong>
          <span>Alerts after 10 minutes · 10-minute threshold</span>
        </div>
      </div>
    </div>
  )
}
