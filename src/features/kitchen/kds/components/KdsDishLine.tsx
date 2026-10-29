import { kdsToneStyles } from '../constants'
import { Icon } from '../../../../components/Icon/Icon'
import { clock, elapsed } from '../utils/format'
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
  column,
  now,
  late,
  onSelect,
  onRecipe,
  onTransition,
}: Props) {
  const tone = kdsToneStyles[column.tone]
  return (
    <div className="mt-4 border-t border-dashed border-[#dce5dc] pt-3.5">
      <div className="flex items-center justify-between gap-1 text-sm text-[#475569] md:text-base [&>span]:flex [&>span]:items-center [&>span]:gap-[5px] [&_i]:size-1 [&_i]:rounded-full [&_i]:bg-[#b0beb1]">
        <span
          className={`rounded-[5px] px-1.5 py-1 font-bold [&>i]:bg-current! ${tone.badge}`}
        >
          <i /> {column.title}
        </span>
        <span
          className={`flex items-center gap-[5px] rounded-[5px] px-1.5 py-1 tabular-nums whitespace-nowrap ${late(ticket) ? 'bg-[#fff0e9] text-[#c17047]' : 'bg-[#f2f5f2] text-[#475569]'}`}
          title="Thời gian từ khi nhận đơn"
        >
          <Icon name="clock" size={13} />
          {elapsed(ticket.created, now)}
        </span>
      </div>
      <div className="hidden" />
      <div className="mt-4 flex min-w-0 items-center gap-[9px] [&>div:nth-child(2)]:min-w-0 [&>div:nth-child(2)]:flex-1 [&_h4]:text-xl [&_h4]:leading-normal [&_h4]:font-[650] md:[&_h4]:text-xl min-[1600px]:[&_h4]:text-xl [&>div:nth-child(2)>span]:text-sm [&>div:nth-child(2)>span]:text-[#475569] [&>div:nth-child(2)>span]:wrap-anywhere md:[&>div:nth-child(2)>span]:text-sm [&_img]:size-16 [&_img]:rounded-[9px] [&_img]:object-cover">
        <div className="grid min-w-8 gap-1 border-r border-[#e8ede7] pr-2.5 text-center text-[32px] leading-[1.1] font-bold [&>span]:text-sm [&>span]:font-[550] [&>span]:tracking-[1px] [&>span]:text-slate-600">
          {ticket.quantity}
        </div>
        <div>
          <h4>{dish.name}</h4>
          <span>Nhận lúc {clock(ticket.created)}</span>
        </div>
        <button
          type="button"
          className={`relative shrink-0 rounded-[9px] outline-offset-3 hover:ring-2 ${tone.ring}`}
          aria-label={`Xem công thức ${dish.name}`}
          title="Bấm để xem công thức"
          onClick={() => onRecipe(dish.id)}
        >
          <img src={dish.image} alt={dish.name} />
          <Icon
            name="receipt"
            size={12}
            className={`absolute -right-[3px] -bottom-[3px] box-content rounded-[5px] p-[3px] text-white ${tone.header}`}
          />
        </button>
      </div>
      <div
        className={`mt-3.5 flex min-h-12 items-start gap-[7px] rounded-[7px] border p-3 text-base leading-[1.6] [&>p]:wrap-anywhere ${ticket.note ? 'border-[#f4ecd9] bg-[#fbf5e9] text-[#854d0e]' : 'border-[#edf1e9] bg-[#f7f9f6] text-[#475569]'}`}
      >
        <Icon name="message" size={15} />
        <p>{ticket.note || 'Không có yêu cầu đặc biệt'}</p>
      </div>
      {ticket.previousNote !== undefined && (
        <button
          className="mt-[9px] flex items-center gap-[5px] text-sm text-[#475569] [&>span]:size-1 [&>span]:rounded-full [&>span]:bg-[#7ca3b2]"
          onClick={() => onSelect(ticket.id)}
        >
          <span /> Ghi chú đã cập nhật <Icon name="chevron" size={12} />
        </button>
      )}
      <div className="mt-4 flex items-center gap-[7px]">
        <button
          className="grid h-12 min-h-12 w-12 shrink-0 place-items-center rounded-[7px] border border-[#e1e8df] bg-white text-[#475569] hover:bg-[#f1f5ef] motion-safe:transition-colors motion-safe:duration-150 "
          onClick={() => onSelect(ticket.id)}
          aria-label={`Chi tiết ${ticket.id}`}
        >
          <Icon name="receipt" size={18} />
        </button>
        {ticket.status === 'Hold' ? (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-violet-700">
            <Icon name="clock" size={17} /> Chờ yêu cầu chế biến
          </div>
        ) : ticket.status === 'Ready' ? (
          <div className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-[7px] bg-[#edf6ee] p-2 text-sm font-semibold text-[#166534]">
            <Icon name="check" size={17} /> Chờ nhân viên phục vụ nhận món
          </div>
        ) : (
          <button
            className={`flex min-h-12 flex-1 items-center justify-center gap-[7px] rounded-[7px] px-2 py-3 text-base font-semibold text-white motion-safe:transition-colors motion-safe:duration-150 md:text-base min-[1251px]:text-base min-[1600px]:text-base [&>svg:last-child]:ml-auto md:max-[1250px]:[&>svg:last-child]:hidden ${ticket.status === 'Cooking' ? 'bg-[#346382] hover:bg-[#234963]' : 'bg-[#234d3b] hover:bg-[#14392a]'}`}
            onClick={() => onTransition(ticket)}
          >
            <Icon
              name={ticket.status === 'Pending' ? 'fire' : 'check'}
              size={17}
            />
            {ticket.status === 'Pending' ? 'Bắt đầu nấu' : 'Hoàn thành món'}
            <Icon name="arrow" size={16} />
          </button>
        )}
      </div>
      {ticket.status === 'Cooking' && ticket.started && (
        <p className="mt-2 text-center text-sm text-[#475569]">
          Đã nấu được {elapsed(ticket.started, now)}
        </p>
      )}
      {ticket.status === 'Ready' && ticket.finished && (
        <p className="mt-2 text-center text-sm text-[#475569]">
          Hoàn thành lúc {clock(ticket.finished)}
        </p>
      )}
    </div>
  )
}
