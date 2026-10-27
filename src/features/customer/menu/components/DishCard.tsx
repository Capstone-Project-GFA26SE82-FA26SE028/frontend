import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import { DishImage } from './DishImage'
import type { Dish } from '../types/types'
export function DishCard({
  dish,
  onSelect,
}: {
  dish: Dish
  onSelect: () => void
}) {
  const available = dish.canOrder && dish.price !== null
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white transition-shadow hover:shadow-xl hover:shadow-brand/5">
      <button
        onClick={onSelect}
        className="relative block w-full text-left"
        aria-label={'View ' + dish.itemName}
      >
        <DishImage
          src={dish.imageUrl}
          name={dish.itemName}
          className={
            'aspect-[1.48] w-full ' + (!available ? 'opacity-60 grayscale' : '')
          }
        />
        {!available && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-ink/85 px-4 py-2 text-xs text-white">
              Unavailable
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
                {dish.preparationTimeMinutes} min
              </span>
            )}
        </div>
        <h3>
          <button
            onClick={onSelect}
            className="min-h-11 text-left text-lg font-bold tracking-tight hover:text-brand"
          >
            {dish.itemName}
          </button>
        </h3>
        {dish.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
            {dish.description}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-brand">
            {dish.price === null ? (
              <span className="text-sm font-normal text-muted">
                Price unavailable
              </span>
            ) : (
              formatCurrency(dish.price)
            )}
          </span>
          <button
            disabled={!available}
            onClick={onSelect}
            aria-label={'Choose ' + dish.itemName}
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mint text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-40"
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
    </article>
  )
}
