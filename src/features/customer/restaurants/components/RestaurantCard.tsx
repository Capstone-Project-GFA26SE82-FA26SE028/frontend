import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import type { OnlineRestaurant } from '../types/types'

export function RestaurantCard({
  restaurant,
  onView,
}: {
  restaurant: OnlineRestaurant
  onView: () => void
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showLogo =
    restaurant.logoUrl &&
    /^https?:\/\//i.test(restaurant.logoUrl) &&
    restaurant.logoUrl !== failedUrl
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-sm shadow-stone-900/[0.02] transition-shadow hover:shadow-xl hover:shadow-emerald-950/10">
      <button
        type="button"
        onClick={onView}
        aria-label={'Xem nhà hàng ' + restaurant.restaurantName}
        className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-emerald-900/5 bg-gradient-to-br from-[#e4efdf] via-[#f5f8f1] to-emerald-100/70 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-8 size-40 rounded-full border-[24px] border-white/40"
        />
        {showLogo ? (
          <img
            src={restaurant.logoUrl!}
            alt={'Logo ' + restaurant.restaurantName}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="relative h-full w-full object-contain p-6 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
            onError={() => setFailedUrl(restaurant.logoUrl)}
          />
        ) : (
          <span
            aria-hidden="true"
            className="relative flex size-20 items-center justify-center rounded-3xl border border-white/90 bg-white/80 text-brand shadow-sm shadow-brand/5"
          >
            <Icon name="store" size={36} />
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="break-words text-lg font-bold tracking-tight">
          {restaurant.restaurantName}
        </h3>
        <div className="mt-3 flex items-start gap-2 text-sm text-muted">
          <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-brand" />
          <p className="line-clamp-2 break-words">
            {restaurant.address || 'Chưa cập nhật địa chỉ'}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Icon name="phone" size={15} className="shrink-0 text-brand" />
          <span className="break-all">
            {restaurant.hotline || 'Chưa cập nhật hotline'}
          </span>
        </div>
        <Link
          to={'/restaurants/' + restaurant.restaurantId + '/menu'}
          aria-label={'Xem thực đơn ' + restaurant.restaurantName}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-xl bg-[#226449] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#184c37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Xem thực đơn
          <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  )
}
