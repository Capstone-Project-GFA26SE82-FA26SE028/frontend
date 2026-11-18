import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { TakeawayCartItem } from './TakeawayCartItem'
import type {
  TakeawayCart,
  TakeawayCartLine,
  TakeawayCartEditTarget,
} from '../types/types'
export function TakeawayCartList({
  cart,
  restaurantId,
  blocked,
  onEdit,
  onChange,
}: {
  cart: TakeawayCart
  restaurantId: string
  blocked: boolean
  onEdit: (target: TakeawayCartEditTarget) => void
  onChange: (items: TakeawayCartLine[], version: string) => Promise<boolean>
}) {
  return (
    <div className="panel min-w-0 px-5 sm:px-7">
      {cart.items.map((line, index) => {
        const quoted = cart.quote?.items.find(
          (item) =>
            item.itemId === line.itemId &&
            item.quantity === line.quantity &&
            item.options.length === line.options.length &&
            item.options.every((option) =>
              line.options.some(
                (selected) =>
                  selected.optionId === option.optionId &&
                  selected.quantity === option.quantity,
              ),
            ),
        )
        return (
          <TakeawayCartItem
            key={index + ':' + cart.version}
            line={line}
            quote={quoted}
            errors={
              cart.quote?.errors
                .filter((error) => error.lineIndex === index)
                .map((error) => error.message) ?? []
            }
            disabled={blocked}
            onEdit={() => onEdit({ index, version: cart.version, line })}
            onRemove={() =>
              void onChange(
                cart.items.filter((_, i) => i !== index),
                cart.version,
              )
            }
            onQuantity={(quantity) =>
              void onChange(
                cart.items.flatMap((item, i) =>
                  i !== index
                    ? [item]
                    : quantity > 0
                      ? [{ ...item, quantity }]
                      : [],
                ),
                cart.version,
              )
            }
          />
        )
      })}
      <Link
        to={'/restaurants/' + restaurantId + '/menu'}
        className="my-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand"
      >
        <Icon name="plus" size={18} />
        Chọn thêm món
      </Link>
    </div>
  )
}
