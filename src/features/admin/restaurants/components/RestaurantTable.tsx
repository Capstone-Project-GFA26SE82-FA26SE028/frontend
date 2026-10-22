import { Icon } from '../../../../components/Icon/Icon'
import { useState } from 'react'
import type { Restaurant } from '../types'
import { EmptyState } from '../../components/AdminUI'
export function RestaurantTable({
  items,
  onView,
  onEdit,
}: {
  items: Restaurant[]
  onView: (id: string) => void
  onEdit: (id: string) => void
}) {
  const [failed, setFailed] = useState<string[]>([])
  if (!items.length)
    return (
      <EmptyState
        title="No restaurants found"
        description="Try another name or add your first restaurant."
      />
    )
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-y border-slate-100 bg-slate-50 text-slate-500">
          <tr>
            {['Restaurant', 'Address', 'Hotline', 'Tax code', 'Actions'].map(
              (label) => (
                <th
                  key={label}
                  scope="col"
                  className="px-4 py-3.5 font-semibold"
                >
                  {label}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.restaurantId}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 font-bold text-emerald-700">
                    {item.logoUrl &&
                    /^https?:\/\//i.test(item.logoUrl) &&
                    !failed.includes(item.logoUrl) ? (
                      <img
                        src={item.logoUrl}
                        alt=""
                        className="size-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailed((previous) => [...previous, item.logoUrl!])
                        }
                      />
                    ) : (
                      item.restaurantName.charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="max-w-56 break-words font-semibold">
                    {item.restaurantName}
                  </span>
                </div>
              </td>
              <td className="max-w-72 break-words p-4 text-slate-600">
                {item.address}
              </td>
              <td className="whitespace-nowrap p-4 text-slate-600">
                {item.hotline}
              </td>
              <td className="p-4 text-slate-600">
                {item.taxCode || 'Not provided'}
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    className="flex size-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
                    title="View details"
                aria-label={'View ' + item.restaurantName}
                    onClick={() => onView(item.restaurantId)}
                  >
                    <Icon name="eye" size={19} />
                  </button>
                  <button
                    className="flex size-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
                    title="Edit restaurant"
                aria-label={'Edit ' + item.restaurantName}
                    onClick={() => onEdit(item.restaurantId)}
                  >
                    <Icon name="edit" size={19} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
