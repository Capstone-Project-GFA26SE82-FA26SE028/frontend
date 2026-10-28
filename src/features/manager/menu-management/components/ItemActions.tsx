import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { secondaryButton } from '../../../admin/components/AdminUI'
import type { ItemCollectionProps, Item } from '../types/catalog'

type Props = Pick<ItemCollectionProps, 'onEdit' | 'onStatus'> & {
  item: Item
  compact?: boolean
}

export function ItemActions({
  item,
  onEdit,
  onStatus,
  compact = false,
}: Props) {
  return (
    <div
      className={compact ? 'flex justify-end gap-2' : 'grid grid-cols-2 gap-2'}
    >
      <Link
        to={`/manager/menu/prices?itemId=${item.itemId}`}
        className={secondaryButton}
      >
        Pricing
      </Link>
      <Link
        to={`/manager/recipes?itemId=${item.itemId}`}
        className={secondaryButton}
      >
        Recipe
      </Link>
      <button
        type="button"
        className={secondaryButton}
        aria-label={`Edit ${item.itemName}`}
        onClick={() => onEdit(item)}
      >
        <Icon name="edit" size={16} />
        {!compact && 'Edit'}
      </button>
      <button
        type="button"
        className={secondaryButton}
        aria-label={`Update availability for ${item.itemName}`}
        onClick={() => onStatus(item)}
      >
        Status
      </button>
    </div>
  )
}
