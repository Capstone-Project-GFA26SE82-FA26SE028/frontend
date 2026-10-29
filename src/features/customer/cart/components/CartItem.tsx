import { Icon } from '../../../../components/Icon/Icon'
import { formatCurrency } from '../../../../utils/currency'
import type { CartLine, QuotedItem } from '../types/types'
import { quotedUnitPrice } from '../cartHelpers'
export function CartItem({
  line,
  quote,
  errors,
  disabled,
  onQuantity,
  onRemove,
  onEdit,
}: {
  line: CartLine
  quote?: QuotedItem
  errors: string[]
  disabled: boolean
  onQuantity: (quantity: number) => void
  onRemove: () => void
  onEdit: () => void
}) {
  return (
    <article className="flex gap-4 border-b border-stone-100 py-5 last:border-0">
      <span
        aria-hidden="true"
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-mint text-brand"
      >
        <Icon name="utensils" size={25} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold">
            {quote?.name || 'Món không còn phục vụ'}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <button
              className="flex size-9 items-center justify-center rounded-lg text-brand hover:bg-mint disabled:opacity-40"
              aria-label={'Sửa ' + (quote?.name || 'món')}
              disabled={disabled}
              onClick={onEdit}
            >
              <Icon name="edit" size={17} />
            </button>
            <button
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 disabled:opacity-40"
              aria-label={'Xóa ' + (quote?.name || 'món')}
              disabled={disabled}
              onClick={onRemove}
            >
              <Icon name="trash" size={17} />
            </button>
          </div>
        </div>
        {quote?.options.map((option) => (
          <p key={option.optionId} className="mt-1 text-xs text-muted">
            {option.name}
            {option.quantity > 1 ? ' x ' + option.quantity : ''}
          </p>
        ))}
        {line.note && (
          <p className="mt-1 break-words text-xs text-muted">
            Ghi chú: {line.note}
          </p>
        )}
        {errors.map((error, i) => (
          <p key={i} role="alert" className="mt-2 text-xs text-rose-700">
            {error}
          </p>
        ))}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-brand">
            {quote
              ? formatCurrency(quotedUnitPrice(quote) * line.quantity)
              : 'Chưa có giá'}
          </span>
          <div className="flex items-center rounded-xl border border-stone-200">
            <button
              aria-label={'Giảm số lượng ' + (quote?.name || 'món')}
              disabled={disabled}
              onClick={() => onQuantity(line.quantity - 1)}
              className="flex size-11 items-center justify-center disabled:opacity-40"
            >
              <Icon name="minus" size={16} />
            </button>
            <span className="w-8 text-center text-sm">{line.quantity}</span>
            <button
              aria-label={'Tăng số lượng ' + (quote?.name || 'món')}
              disabled={disabled || line.quantity >= 1000}
              onClick={() => onQuantity(line.quantity + 1)}
              className="flex size-11 items-center justify-center disabled:opacity-40"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
