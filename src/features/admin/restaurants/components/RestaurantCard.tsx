import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import type { Restaurant } from '../types'
export function RestaurantCard({
  restaurant: item,
  onView,
  onEdit,
}: {
  restaurant: Restaurant
  onView: (id: string) => void
  onEdit: (id: string) => void
}) {
  const [failed, setFailed] = useState<string[]>([])
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-200">
        {item.logoUrl &&
        /^https?:\/\//i.test(item.logoUrl) &&
        !failed.includes(item.logoUrl) ? (
          <img
            src={item.logoUrl}
            alt={item.restaurantName}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={() => setFailed((prev) => [...prev, item.logoUrl!])}
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-3xl border border-white/70 bg-white/60 text-emerald-700">
            <Icon name="store" size={40} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="break-words text-lg font-bold text-slate-800">
          {item.restaurantName}
        </h2>
        <div className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-500">
          <Icon name="pin" size={16} />
          <p className="line-clamp-2 min-h-10 break-words" title={item.address}>
            {item.address}
          </p>
        </div>
        <dl className="my-3 grid grid-cols-2 gap-2 text-sm">
          <div className="min-w-0 rounded-xl bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">Hotline</dt>
            <dd className="mt-1 break-words font-semibold text-slate-700">
              {item.hotline}
            </dd>
          </div>
          <div className="min-w-0 rounded-xl bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">Tax code</dt>
            <dd className="mt-1 break-words font-semibold text-slate-700">
              {item.taxCode || 'Not provided'}
            </dd>
          </div>
        </dl>
        <div className="mt-auto grid grid-cols-2 gap-3">
          <button
            title="View details"
            aria-label={'View ' + item.restaurantName}
            onClick={() => onView(item.restaurantId)}
            className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            <Icon name="eye" size={19} />
            View
          </button>
          <button
            title="Edit restaurant"
            aria-label={'Edit ' + item.restaurantName}
            onClick={() => onEdit(item.restaurantId)}
            className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          >
            <Icon name="edit" size={19} />
            Edit
          </button>
        </div>
      </div>
    </article>
  )
}
