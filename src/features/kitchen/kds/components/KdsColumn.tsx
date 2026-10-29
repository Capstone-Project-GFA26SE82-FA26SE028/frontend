import { kdsToneStyles } from '../constants'
import { Icon } from '../../../../components/Icon/Icon'
import { KdsOrderCard } from './KdsOrderCard'
import type { KdsBoardProps, KdsColumnDefinition } from '../types'

type Props = Omit<KdsBoardProps, 'shown'> & {
  column: KdsColumnDefinition
  items: KdsBoardProps['shown']
}

export function KdsColumn({
  column,
  items,
  active,
  dishes,
  now,
  late,
  isFiltered,
  onSelect,
  onRecipe,
  onTransition,
}: Props) {
  const tone = kdsToneStyles[column.tone]
  return (
    <section
      className={`flex min-w-0 flex-col overflow-hidden rounded-[13px] border ${tone.column}`}
      data-status={column.status}
      key={column.status}
      aria-label={column.title}
    >
      <div
        className={`border-b border-black/5 px-4 py-4 text-white ${tone.header}`}
      >
        <div className="flex items-center gap-2 [&>h2]:flex-1 [&>h2]:text-lg [&>h2]:font-bold [&>b]:grid [&>b]:size-8 [&>b]:place-items-center [&>b]:rounded-lg [&>b]:bg-white/15 [&>b]:text-base [&>b]:font-bold [&>b]:text-white">
          <span className="grid size-[31px] place-items-center rounded-[9px] border border-black/[0.02] bg-white/15 text-white">
            <Icon name={column.icon} size={19} />
          </span>
          <h2>{column.title}</h2>
          <b>{items.length}</b>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-[13px] px-[11px] py-3 md:min-h-[355px] min-[1600px]:min-h-[430px]">
        {items.map((order) => (
          <KdsOrderCard
            key={order.id}
            order={order}
            active={active}
            dishes={dishes}
            column={column}
            now={now}
            late={late}
            onSelect={onSelect}
            onRecipe={onRecipe}
            onTransition={onTransition}
          />
        ))}
        {!items.length && (
          <div className="flex min-h-[180px] flex-1 flex-col items-center justify-center rounded-[10px] border border-dashed border-[#cfdacf] p-5 text-center text-[#475569] md:min-h-[235px] [&>span]:mb-[15px] [&>span]:grid [&>span]:size-[55px] [&>span]:place-items-center [&>span]:rounded-full [&>span]:bg-white/45 [&>span]:text-[#99b4a1] [&>strong]:text-base [&>strong]:font-semibold [&>p]:mt-[7px] [&>p]:max-w-64 [&>p]:text-sm [&>p]:leading-[1.7] [&>p]:text-[#64748b]">
            <span>
              <Icon name={column.icon} size={28} />
            </span>
            <strong>
              {isFiltered
                ? 'Không có món phù hợp'
                : column.status === 'Pending'
                  ? 'Đã xử lý hết món đang chờ'
                  : column.status === 'Hold'
                    ? 'Không có món tạm hoãn'
                    : column.status === 'Cooking'
                      ? 'Bếp sẵn sàng'
                      : 'Chưa có món hoàn thành'}
            </strong>
            <p>
              {isFiltered
                ? 'Thử tìm kiếm hoặc bộ lọc khác.'
                : column.status === 'Hold'
                  ? 'Món đang giữ sẽ xuất hiện tại đây.'
                  : column.status === 'Ready'
                    ? 'Món đã hoàn thành sẽ xuất hiện tại đây.'
                    : 'Món mới sẽ xuất hiện tại đây.'}
            </p>
          </div>
        )}
      </div>
      <div className="mx-[13px] flex justify-between border-t border-black/[0.025] px-0.5 py-3 text-sm text-[#475569] [&>span:last-child]:text-sm  ">
        <span>
          {items.length} đơn ·{' '}
          {items.reduce(
            (n, order) =>
              n + order.lines.reduce((sum, t) => sum + t.quantity, 0),
            0,
          )}{' '}
          phần
        </span>
        <span>{column.title}</span>
      </div>
    </section>
  )
}
