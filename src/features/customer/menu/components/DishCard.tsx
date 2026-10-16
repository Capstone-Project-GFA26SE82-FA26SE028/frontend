import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import type { Dish } from '../types'
export function DishCard({
  dish,
  onSelect,
}: {
  dish: Dish
  onSelect: () => void
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white transition-shadow hover:shadow-xl hover:shadow-brand/5">
      <button
        onClick={onSelect}
        className="relative block w-full overflow-hidden text-left"
        aria-label={`Xem ${dish.name}`}
      >
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          width="600"
          height="420"
          className={`aspect-[1.48] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 ${!dish.available ? 'grayscale opacity-60' : ''}`}
        />
        {dish.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-brand shadow-sm">
            {dish.tag}
          </span>
        )}
        {!dish.available && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-ink/85 px-5 py-2 text-sm text-white">
              Tạm hết món
            </span>
          </span>
        )}
      </button>
      <div className="p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <Icon name="clock" size={14} />
          {dish.minutes} phút
          {dish.vegetarian && (
            <span className="ml-auto flex items-center gap-1 text-brand">
              <Icon name="leaf" size={14} />
              Món chay
            </span>
          )}
          {dish.spicy && (
            <span className="ml-auto flex items-center gap-1 text-orange-700">
              <Icon name="fire" size={14} />
              Cay nhẹ
            </span>
          )}
        </div>
        <h3>
          <button
            onClick={onSelect}
            className="min-h-11 text-left text-lg font-bold tracking-tight hover:text-brand"
          >
            {dish.name}
          </button>
        </h3>
        <p className="mt-1 min-h-10 text-sm leading-relaxed text-muted">
          {dish.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-brand">
            {formatCurrency(dish.price)}
          </span>
          <button
            disabled={!dish.available}
            onClick={onSelect}
            aria-label={`Thêm ${dish.name}`}
            className="flex size-11 items-center justify-center rounded-2xl bg-mint text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
    </article>
  )
}
