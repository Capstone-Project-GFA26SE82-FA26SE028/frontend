import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'

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
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
      >
        Giá bán
      </Link>
      <Link
        to={`/manager/recipes?itemId=${item.itemId}`}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
      >
        Công thức
      </Link>
      <button
        type="button"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        aria-label={`Sửa ${item.itemName}`}
        onClick={() => onEdit(item)}
      >
        <Icon name="edit" size={16} />
        {!compact && 'Sửa'}
      </button>
      <button
        type="button"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        aria-label={`Cập nhật tình trạng bán của ${item.itemName}`}
        onClick={() => onStatus(item)}
      >
        Trạng thái
      </button>
    </div>
  )
}
