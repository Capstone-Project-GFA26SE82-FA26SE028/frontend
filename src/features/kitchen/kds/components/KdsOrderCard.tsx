import { kdsToneStyles } from '../constants'
import { Icon } from '../../../../components/Icon/Icon'
import { elapsed, getTicketTimeUrgency } from '../utils/format'
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

  // Tính toán mức độ khẩn cấp theo thời gian của từng món trong đơn
  const lineUrgencies = order.lines.map((t) =>
    getTicketTimeUrgency(t, now, late(t)),
  )
  const isAnyLate = lineUrgencies.some((u) => u.status === 'late')
  const isAnyWarning =
    !isAnyLate && lineUrgencies.some((u) => u.status === 'warning')

  // Định dạng mã đơn ngắn gọn, tránh tràn lề thẻ bếp
  const orderDisplay =
    order.id.startsWith('ORD-') && order.id.length > 12
      ? `#${order.id.replace('ORD-', '').slice(-6).toUpperCase()}`
      : order.id

  // Đếm tiến độ món của cả đơn hàng
  const totalInOrder = active.filter((t) => t.order === order.id).length
  const readyInOrder = active.filter(
    (t) => t.order === order.id && t.status === 'Ready',
  ).length
  const progressPercent = totalInOrder > 0 ? (readyInOrder / totalInOrder) * 100 : 0

  return (
    <article
      key={order.id}
      className={`min-w-0 rounded-2xl border bg-white p-4 shadow-xs transition-all hover:shadow-md ${
        isAnyLate
          ? 'border-t-4 border-t-rose-500 border-slate-200/90'
          : isAnyWarning
            ? 'border-t-4 border-t-amber-500 border-slate-200/90'
            : `border-t-4 ${tone.card} border-slate-200/90`
      }`}
      aria-label={`Đơn ${column.title}, ${order.lines.length} dòng món`}
    >
      {/* Header vé đơn hàng */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
            <Icon name="ticket" size={13} />
          </span>
          <span
            className="truncate text-sm font-extrabold tracking-tight text-slate-900"
            title={`Mã đơn: ${order.id}`}
          >
            {orderDisplay}
          </span>
          <span className="shrink-0 text-xs font-medium text-slate-400">
            · {order.lines.length} món
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {order.vip && (
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-900 shadow-2xs">
              <Icon name="crown" size={11} className="text-amber-600" />
              VIP
            </span>
          )}

          {/* Badge Thời gian trôi qua - Gọn gàng, không bị tràn viền */}
          {isAnyLate ? (
            <span
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-extrabold text-rose-700 shadow-2xs whitespace-nowrap"
              title="Đơn hàng có món trễ giờ nấu"
            >
              <Icon name="clock" size={12} className="text-rose-600" />
              {elapsed(order.created, now)}
            </span>
          ) : isAnyWarning ? (
            <span
              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 shadow-2xs whitespace-nowrap"
              title="Đơn hàng có món sắp tới hạn"
            >
              <Icon name="clock" size={12} className="text-amber-600" />
              {elapsed(order.created, now)}
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 tabular-nums whitespace-nowrap"
              title="Thời gian từ khi nhận đơn"
            >
              <Icon name="clock" size={12} className="text-slate-400" />
              {elapsed(order.created, now)}
            </span>
          )}
        </div>
      </div>

      {/* Thanh tiến độ đơn */}
      {totalInOrder > 1 && (
        <div className="mt-2.5 space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>Tiến độ chế biến</span>
            <span>
              {readyInOrder}/{totalInOrder} món xong
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isAnyLate
                  ? 'bg-rose-500'
                  : isAnyWarning
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Danh sách từng dòng món */}
      <div className="divide-y divide-dashed divide-slate-100">
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
      </div>
    </article>
  )
}

