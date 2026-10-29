import { kdsToneStyles } from '../constants'
import { Icon } from '../../../../components/Icon/Icon'
import { elapsed } from '../utils/format'
import { KdsDishLine } from './KdsDishLine'
import type {
  Ticket,
  Dish,
  KdsOrder,
  KdsColumnDefinition,
  KdsActions,
} from '../types'

type Props = KdsActions & {
  order: KdsOrder
  active: Ticket[]
  dishes: Dish[]
  column: KdsColumnDefinition
  now: number
  late: (ticket: Ticket) => boolean
}

export function KdsOrderCard({
  order,
  active,
  dishes,
  column,
  now,
  late,
  onSelect,
  onRecipe,
  onTransition,
}: Props) {
  const tone = kdsToneStyles[column.tone]
  return (
    <article
      key={order.id}
      className={`min-w-0 rounded-[11px] border border-t-[3px] border-[#e2e8e0] bg-white p-4 min-[1600px]:p-5 ${tone.card} ${order.lines.some(late) ? 'shadow-[inset_3px_0_#e11d48]' : 'shadow-[0_3px_8px_#1b412607]'}`}
      aria-label={`Đơn ${order.id}`}
    >
      <div className="flex items-center justify-between gap-1 text-sm text-[#475569] md:text-sm [&>span]:flex [&>span]:items-center [&>span]:gap-[5px] [&_i]:size-1 [&_i]:rounded-full [&_i]:bg-[#b0beb1]">
        <span>
          <i /> ĐƠN · {order.lines.length} dòng món
        </span>
        <span className="flex items-center gap-[5px] rounded-[5px] bg-[#f2f5f2] px-1.5 py-1 text-[#475569] tabular-nums whitespace-nowrap">
          <Icon name="clock" size={13} />
          {elapsed(order.created, now)}
        </span>
      </div>
      <div className="mt-[7px] flex items-center justify-between">
        <h3 className="text-[22px] font-[750] tracking-[-0.8px] wrap-anywhere">
          {order.id}
        </h3>
        {order.vip && (
          <span className="flex items-center gap-1 rounded-[5px] border border-[#f1e6c8] bg-[#faf2df] px-1.5 py-[3px] text-sm font-[650] text-[#854d0e]">
            <Icon name="crown" size={12} /> VIP
          </span>
        )}
      </div>
      <p className="mt-[5px] text-sm text-[#475569]">
        {
          active.filter((t) => t.order === order.id && t.status === 'Ready')
            .length
        }
        /{active.filter((t) => t.order === order.id).length} món đã xong
      </p>
      {order.lines.map((ticket) => {
        const dish = dishes.find((item) => item.id === ticket.dishId)
        return dish ? (
          <KdsDishLine
            key={ticket.id}
            ticket={ticket}
            dish={dish}
            column={column}
            now={now}
            late={late}
            onSelect={onSelect}
            onRecipe={onRecipe}
            onTransition={onTransition}
          />
        ) : null
      })}
    </article>
  )
}
