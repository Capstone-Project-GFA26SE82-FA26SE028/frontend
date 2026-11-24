import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../app/hooks'
import { Icon } from '../../../components/Icon/Icon'
import { getOnlineRestaurants } from '../../../features/customer/restaurants/api/restaurantApi'

export function StaffSidebarRestaurant({ collapsed }: { collapsed: boolean }) {
  const restaurantId = useAppSelector(
    (state) => state.auth.session?.user.restaurantId,
  )
  const [failedLogo, setFailedLogo] = useState<string>()
  const restaurant = useQuery({
    queryKey: ['sidebar-restaurant', restaurantId],
    enabled: !!restaurantId,
    staleTime: 60_000,
    queryFn: async ({ signal }) => {
      for (let page = 1; ; page++) {
        const result = await getOnlineRestaurants(page, 100, signal)
        const item = result.items.find(
          (entry) => entry.restaurantId === restaurantId,
        )
        if (item) return item
        if (
          !result.items.length ||
          result.page * result.pageSize >= result.totalCount
        )
          return null
      }
    },
  })
  if (!restaurantId) return null
  const logo = restaurant.data?.logoUrl
  const label =
    restaurant.data?.restaurantName ||
    (restaurant.isPending ? 'Đang tải nhà hàng…' : 'Nhà hàng được phân công')

  return (
    <div
      title={label}
      className={`mb-3 flex shrink-0 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 ${collapsed ? 'mx-3 justify-center p-1.5' : 'mx-4 px-2.5 py-2'}`}
    >
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10 text-emerald-100">
        {logo && /^https?:\/\//i.test(logo) && logo !== failedLogo ? (
          <img
            src={logo}
            alt=""
            className="size-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setFailedLogo(logo)}
          />
        ) : (
          <Icon name="store" size={17} />
        )}
      </span>
      <span
        className={
          collapsed ? 'sr-only' : 'min-w-0 truncate text-sm font-semibold'
        }
      >
        {label}
      </span>
    </div>
  )
}
