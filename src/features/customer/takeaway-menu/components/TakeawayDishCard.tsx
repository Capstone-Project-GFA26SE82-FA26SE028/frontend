import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import type { TakeawayDish } from '../types/types'

export function TakeawayDishCard({
  dish,
  onView,
}: {
  dish: TakeawayDish
  onView: () => void
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-sm">
      <button
        type="button"
        onClick={onView}
        aria-label={'Xem món ' + dish.itemName}
        className="focus-visible:outline-2 focus-visible:outline-brand"
      >
        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-mint">
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
      </button>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-muted">{dish.categoryName}</p>
        <h2 className="mt-1 break-words text-lg font-bold">{dish.itemName}</h2>
        {dish.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">
            {dish.description}
          </p>
        )}
        {!dish.canOrder && (
          <p className="mt-3 text-xs font-semibold text-amber-700">
            Không khả dụng
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <p className="font-bold text-brand">
            {dish.price === null
              ? 'Chưa có giá'
              : dish.price.toLocaleString('vi-VN') + ' đ'}
          </p>
          <button
            type="button"
            onClick={onView}
            aria-label={'Chi tiết ' + dish.itemName}
            className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-brand hover:bg-emerald-100"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </article>
  )
}
