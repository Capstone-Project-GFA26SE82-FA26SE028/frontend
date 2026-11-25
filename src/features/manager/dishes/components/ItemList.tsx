import { tableClass } from '../constants/styles'
import type { ItemCollectionProps } from '../types/catalog'
import { ItemActions } from './ItemActions'
import { ItemImage } from './ItemImage'
import { ItemStatusBadge } from './ItemStatusBadge'

export function ItemList({ items, onEdit, onStatus }: ItemCollectionProps) {
  return (
    <div className="overflow-x-auto">
      <table className={tableClass} aria-label="Món ăn dạng danh sách">
        <thead className="bg-slate-50/70">
          <tr>
            <th>Món ăn</th>
            <th>Danh mục</th>
            <th>Tình trạng bán</th>
            <th className="text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.itemId} className="hover:bg-emerald-50/30">
              <td>
                <div className="flex min-w-56 items-center gap-3">
                  <ItemImage
                    src={item.imageUrl}
                    name={item.itemName}
                    className="size-14 rounded-xl"
                  />
                  <div>
                    <p className="font-semibold">{item.itemName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.itemCode}
                    </p>
                    {item.description && (
                      <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td>{item.categoryName}</td>
              <td>
                <ItemStatusBadge item={item} />
              </td>
              <td>
                <ItemActions
                  item={item}
                  onEdit={onEdit}
                  onStatus={onStatus}
                  compact
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
