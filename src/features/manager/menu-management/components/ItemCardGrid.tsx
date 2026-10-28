import type { ItemCollectionProps } from '../types/catalog'
import { ItemActions } from './ItemActions'
import { ItemImage } from './ItemImage'
import { ItemStatusBadge } from './ItemStatusBadge'

export function ItemCardGrid({ items, onEdit, onStatus }: ItemCollectionProps) {
  return (
    <ul
      aria-label="Menu items card view"
      className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {items.map((item) => (
        <li
          key={item.itemId}
          className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative">
            <ItemImage
              src={item.imageUrl}
              name={item.itemName}
              className="aspect-[16/10] w-full"
            />
            <div className="absolute right-3 top-3 rounded-full bg-white p-0.5 shadow-sm">
              <ItemStatusBadge item={item} />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                {item.categoryName}
              </p>
              <h2 className="mt-1 break-words text-lg font-bold text-slate-800">
                {item.itemName}
              </h2>
              <p className="mt-1 break-words text-sm text-slate-500">
                {item.itemCode}
              </p>
            </div>
            {item.description && (
              <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            )}
            <div className="mt-auto border-t border-slate-100 pt-4">
              <ItemActions item={item} onEdit={onEdit} onStatus={onStatus} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
