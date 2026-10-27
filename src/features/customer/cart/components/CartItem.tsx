import { useAppDispatch } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import { setQuantity } from '../cartSlice'
import type { CartItem as Item } from '../types'
export function CartItem({ item }: { item: Item }) {
  const dispatch = useAppDispatch()
  return (
    <article className="flex gap-4 border-b border-stone-100 py-5 last:border-0">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="size-20 shrink-0 rounded-2xl object-cover sm:size-24"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-mint text-brand/40 sm:size-24"
        >
          <Icon name="utensils" size={28} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">{item.name}</h2>
        <p className="mt-1 text-xs text-muted">{item.option}</p>
        {item.note && (
          <p className="mt-1 break-words text-xs text-muted">
            Ghi chú: {item.note}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-brand">
            {formatCurrency(item.unitPrice * item.quantity)}
          </span>
          <div className="flex items-center rounded-xl border border-stone-200">
            <button
              aria-label={`Giảm số lượng ${item.name}`}
              onClick={() =>
                dispatch(
                  setQuantity({ id: item.id, quantity: item.quantity - 1 }),
                )
              }
              className="flex size-11 items-center justify-center"
            >
              <Icon name="minus" size={16} />
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <button
              disabled={item.quantity >= 99}
              aria-label={`Tăng số lượng ${item.name}`}
              onClick={() =>
                dispatch(
                  setQuantity({ id: item.id, quantity: item.quantity + 1 }),
                )
              }
              className="flex size-11 items-center justify-center"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
