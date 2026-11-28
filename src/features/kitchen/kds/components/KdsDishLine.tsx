import { Icon } from '../../../../components/Icon/Icon'
import { clock, elapsed, getTicketTimeUrgency } from '../utils/format'
import type { Ticket, Dish, KdsColumnDefinition, KdsActions } from '../types'

type Props = KdsActions & {
  ticket: Ticket
  dish: Dish
  column: KdsColumnDefinition
  now: number
  late: (ticket: Ticket) => boolean
}

export function KdsDishLine({
  ticket,
  dish,
  column: _column,
  now,
  late,
  onSelect,
  onRecipe,
  onTransition,
}: Props) {
  const isLate = late(ticket)
  const urgency = getTicketTimeUrgency(ticket, now, isLate)

  const isCooking = ticket.status === 'Cooking'
  const isReady = ticket.status === 'Ready'
  const isHold = ticket.status === 'Hold'

  // Kiểu màu sắc theo mức độ khẩn cấp (Bình thường / Gần hết giờ / Quá giờ)
  const urgencyBadgeStyle =
    urgency.status === 'late'
      ? 'border border-rose-200 bg-rose-50 text-rose-700 font-extrabold animate-pulse'
      : urgency.status === 'warning'
        ? 'border border-amber-200 bg-amber-50 text-amber-800 font-bold'
        : 'bg-slate-100 text-slate-600 font-medium'

  const quantityBgStyle =
    urgency.status === 'late'
      ? 'border-2 border-rose-500 bg-rose-50 text-rose-800'
      : urgency.status === 'warning'
        ? 'border-2 border-amber-500 bg-amber-50 text-amber-900'
        : 'bg-slate-900 text-white'

  return (
    <div className="pt-3 pb-2 transition-all">
      {/* Thông tin thời gian và trạng thái cảnh báo thời hạn */}
      <div className="flex items-center justify-between gap-1 text-xs text-slate-500">
        <span className="flex items-center gap-1 font-medium text-slate-600">
          <span
            className={`size-1.5 rounded-full ${
              urgency.status === 'late'
                ? 'bg-rose-500 animate-pulse'
                : urgency.status === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
            }`}
          />
          Nhận lúc {clock(ticket.created)}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 tabular-nums ${urgencyBadgeStyle}`}
          title={urgency.label}
        >
          <Icon name="clock" size={11} />
          <span>{urgency.label}</span>
        </span>
      </div>

      {/* Thân món: Số lượng + Tên món + Ảnh thumbnail tra công thức */}
      <div className="mt-2.5 flex items-start gap-3">
        {/* Số lượng phần ăn lớn, đổi màu đỏ/vàng tinh tế khi sắp hoặc quá giờ */}
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-black shadow-2xs transition-colors ${quantityBgStyle}`}
        >
          ×{ticket.quantity}
        </div>

        {/* Tên món & Khu vực trạm */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold leading-snug text-slate-900">
            {dish.name}
          </h4>
          <span className="text-xs text-slate-500">{dish.area}</span>
        </div>

        {/* Nút Thumbnail tra công thức nấu */}
        <button
          type="button"
          className="group relative size-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 outline-offset-2 hover:ring-2 hover:ring-emerald-500 active:scale-95 transition-all"
          aria-label={`Xem công thức ${dish.name}`}
          title="Bấm để xem công thức chế biến"
          onClick={() => onRecipe(dish.id)}
        >
          <img
            src={dish.image}
            alt={dish.name}
            className="size-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="rounded-full bg-white/90 p-1 text-slate-800 shadow-xs">
              <Icon name="receipt" size={12} />
            </span>
          </div>
        </button>
      </div>

      {/* Thông tin chi tiết thời gian nấu (Khi đang nấu) */}
      {isCooking && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Icon
                name="fire"
                size={13}
                className={
                  urgency.status === 'late'
                    ? 'text-rose-600'
                    : urgency.status === 'warning'
                      ? 'text-amber-600'
                      : 'text-sky-600'
                }
              />
              Đã nấu được {elapsed(ticket.started || ticket.created, now)}
            </span>
            {ticket.estimatedMinutes ? (
              <span className="text-[11px] font-semibold text-slate-500">
                Định mức: {ticket.estimatedMinutes} phút
              </span>
            ) : null}
          </div>
          {/* Thanh tiến độ thời gian nấu: Xanh -> Vàng -> Đỏ */}
          {urgency.progressPercent !== undefined && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  urgency.status === 'late'
                    ? 'bg-rose-500'
                    : urgency.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-sky-500'
                }`}
                style={{ width: `${urgency.progressPercent}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Thông tin hoàn thành (Khi đã xong) */}
      {isReady && (
        <div className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 py-1.5 text-xs font-semibold text-emerald-800">
          <Icon name="check" size={14} className="text-emerald-600" />
          <span>Hoàn thành lúc {clock(ticket.finished || now)}</span>
        </div>
      )}

      {/* Yêu cầu đặc biệt / Ghi chú từ khách */}
      {ticket.note && (
        <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/90 p-2.5 text-xs font-semibold text-amber-900">
          <Icon name="message" size={14} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="break-words">{ticket.note}</p>
        </div>
      )}

      {/* Thông báo nếu có cập nhật ghi chú trước đó */}
      {ticket.previousNote !== undefined && (
        <button
          type="button"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          onClick={() => onSelect(ticket.id)}
        >
          <span className="size-1 rounded-full bg-sky-500" />
          Ghi chú vừa cập nhật
          <Icon name="chevron" size={11} />
        </button>
      )}

      {/* Nút hành động chuyển trạng thái (1 chạm) */}
      <div className="mt-3 flex items-center gap-2">
        {/* Nút mở chi tiết món */}
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 active:scale-95"
          onClick={() => onSelect(ticket.id)}
          aria-label={`Chi tiết ${dish.name}`}
          title="Xem chi tiết dòng món"
        >
          <Icon name="receipt" size={18} />
        </button>

        {/* Nút trạng thái chính */}
        {isHold ? (
          <div className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">
            <Icon name="clock" size={15} />
            Chờ lệnh lên món (Hold)
          </div>
        ) : isReady ? (
          <div className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
            <Icon name="check" size={16} />
            Đã xong · Chờ bưng món
          </div>
        ) : (
          <button
            type="button"
            className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-xs transition-all active:scale-[0.98] ${
              isCooking
                ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/15'
                : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/15'
            }`}
            onClick={() => onTransition(ticket)}
          >
            <Icon
              name={isCooking ? 'check' : 'fire'}
              size={17}
            />
            <span>
              {isCooking ? 'Báo đã xong' : 'Bắt đầu nấu'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

