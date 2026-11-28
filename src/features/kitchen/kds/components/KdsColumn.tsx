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
  const totalPortions = items.reduce(
    (n, order) => n + order.lines.reduce((sum, t) => sum + t.quantity, 0),
    0,
  )

  return (
    <section
      id={`kds-column-${column.status}`}
      className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border shadow-xs transition-all ${tone.column}`}
      data-status={column.status}
      key={column.status}
      aria-label={column.title}
    >
      {/* Column Header */}
      <div className={`px-4 py-3 text-white shrink-0 ${tone.header}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-white/20 text-white shadow-xs">
              <Icon name={column.icon} size={16} />
            </span>
            <h2 className="text-base font-bold tracking-tight">{column.title}</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {totalPortions > 0 && (
              <span className="hidden sm:inline-block rounded-md bg-black/15 px-1.5 py-0.5 text-[11px] font-bold text-white/90">
                {totalPortions} phần
              </span>
            )}
            <span className="flex min-w-7 items-center justify-center rounded-lg bg-white/25 px-2 py-0.5 text-sm font-extrabold text-white shadow-xs">
              {items.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tickets List - Cuộn độc lập bên trong mỗi ô khi cố định màn hình */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 overflow-y-auto">
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

        {/* Empty state */}
        {!items.length && (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/80 bg-white/60 p-6 text-center text-slate-500">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Icon name={column.icon} size={22} />
            </div>
            <strong className="text-sm font-bold text-slate-700">
              {isFiltered
                ? 'Không có món phù hợp'
                : column.status === 'Pending'
                  ? 'Đã xong hết món chờ'
                  : column.status === 'Hold'
                    ? 'Không có món tạm hoãn'
                    : column.status === 'Cooking'
                      ? 'Bếp đang sẵn sàng'
                      : 'Chưa có món xong'}
            </strong>
            <p className="mt-1 text-xs text-slate-500 max-w-52">
              {isFiltered
                ? 'Thử thay đổi từ khóa hoặc bộ lọc.'
                : column.status === 'Hold'
                  ? 'Món giữ theo đợt sẽ hiển thị tại đây.'
                  : column.status === 'Ready'
                    ? 'Món nấu xong sẽ chờ phục vụ lấy tại đây.'
                    : 'Món gọi mới sẽ tự động xuất hiện.'}
            </p>
          </div>
        )}
      </div>

      {/* Column Footer */}
      <div className="flex items-center justify-between border-t border-slate-200/60 bg-white/40 px-4 py-2 text-xs font-semibold text-slate-500">
        <span>{items.length} đơn hàng</span>
        <span>{totalPortions} phần ăn</span>
      </div>
    </section>
  )
}
