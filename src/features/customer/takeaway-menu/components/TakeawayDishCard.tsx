import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import type { TakeawayDish } from '../types/types'

export function TakeawayDishCard({
  dish,
  onView,
}: {
  dish: TakeawayDish
  onView: () => void
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const available = dish.canOrder && dish.price !== null
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white transition-shadow hover:shadow-xl hover:shadow-brand/5">
      <button
        type="button"
        onClick={onView}
        aria-label={'Xem ' + dish.itemName}
        className="relative block w-full text-left focus-visible:outline-2 focus-visible:outline-brand"
      >
        <div
          className={
            'flex aspect-[1.48] w-full items-center justify-center overflow-hidden bg-mint ' +
            (!available ? 'opacity-60 grayscale' : '')
          }
        >
          {dish.imageUrl &&
          /^https?:\/\//i.test(dish.imageUrl) &&
          failedUrl !== dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.itemName}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setFailedUrl(dish.imageUrl)}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon name="utensils" size={40} className="text-brand/35" />
          )}
        </div>
        {!available && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-ink/85 px-4 py-2 text-xs text-white">
              Không khả dụng
            </span>
          </span>
        )}
      </button>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted">
          <span>{dish.categoryName}</span>
          {dish.preparationTimeMinutes !== null &&
            dish.preparationTimeMinutes > 0 && (
              <span className="flex items-center gap-1">
                <Icon name="clock" size={14} />
                {dish.preparationTimeMinutes} phút
              </span>
            )}
        </div>
        <h2>
          <button
            type="button"
            onClick={onView}
            className="min-h-11 text-left text-lg font-bold tracking-tight hover:text-brand"
          >
            {dish.itemName}
          </button>
        </h2>
        {dish.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
            {dish.description}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-brand">
            {dish.price === null ? (
              <span className="text-sm font-normal text-muted">
                Chưa có giá
              </span>
            ) : (
              formatCurrency(dish.price)
            )}
          </span>
          <button
            type="button"
            onClick={onView}
            disabled={!available}
            aria-label={'Chọn ' + dish.itemName}
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mint text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-40"
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
    </article>
  )
}
