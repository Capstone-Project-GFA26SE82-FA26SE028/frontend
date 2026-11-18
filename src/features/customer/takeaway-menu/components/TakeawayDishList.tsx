import { Icon } from '../../../../components/Icon/Icon'
import { restaurantError } from '../../restaurants/api/restaurantApi'
import type { TakeawayDish } from '../types/types'
import { TakeawayDishCard } from './TakeawayDishCard'

export function TakeawayDishList({
  dishes,
  loading,
  error,
  filtered,
  onRetry,
  onClear,
  onView,
}: {
  dishes: TakeawayDish[]
  loading: boolean
  error: unknown
  filtered: boolean
  onRetry: () => void
  onClear: () => void
  onView: (id: string) => void
}) {
  if (loading)
    return (
      <p role="status" className="py-12 text-center">
        Đang tải thực đơn…
      </p>
    )
  if (error)
    return (
      <div className="rounded-2xl bg-white p-6">
        <p role="alert">{restaurantError(error)}</p>
        <button type="button" onClick={onRetry} className="btn-secondary mt-4">
          Thử lại
        </button>
      </div>
    )
  if (!dishes.length)
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 p-10 text-center">
        <Icon name="utensils" size={32} className="mx-auto text-brand" />
        <p className="mt-4">
          {filtered
            ? 'Không tìm thấy món phù hợp.'
            : 'Nhà hàng chưa có món trong thực đơn.'}
        </p>
        {filtered && (
          <button
            type="button"
            onClick={onClear}
            className="mt-3 text-sm font-semibold text-brand"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    )
  return (
    <>
      <p className="mb-4 text-sm text-muted">{dishes.length} món</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <TakeawayDishCard
            key={dish.itemId}
            dish={dish}
            onView={() => onView(dish.itemId)}
          />
        ))}
      </div>
    </>
  )
}
