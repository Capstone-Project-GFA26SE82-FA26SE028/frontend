import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Icon } from '../../../../components/Icon/Icon'
import {
  getRestaurants,
  restaurantError,
} from '../../restaurants/api/restaurantApi'
import { RestaurantStaffSection } from '../components/RestaurantStaffSection'

export function RestaurantStaffPage() {
  const [restaurantId, setRestaurantId] = useState('')
  const [failedLogo, setFailedLogo] = useState<string>()
  const restaurants = useInfiniteQuery({
    queryKey: ['restaurants', 'staff-picker'],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      getRestaurants({ page: pageParam, pageSize: 100 }, signal),
    getNextPageParam: (last) =>
      last.page * last.pageSize < last.totalCount ? last.page + 1 : undefined,
    retry: false,
  })
  const items = restaurants.data?.pages.flatMap((page) => page.items) || []
  const selected = items.find((item) => item.restaurantId === restaurantId)
  return (
    <>
      <PageHeading
        title="Phân công nhân viên"
        description="Quản lý nhân viên theo nhà hàng."
      />
      <div className="mb-5 flex flex-col justify-between gap-5 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-100 to-emerald-50 p-5 sm:p-6 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm shadow-emerald-100/50">
            {selected?.logoUrl &&
            /^https?:\/\//i.test(selected.logoUrl) &&
            selected.logoUrl !== failedLogo ? (
              <img
                src={selected.logoUrl}
                alt={'Logo ' + selected.restaurantName}
                className="size-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setFailedLogo(selected.logoUrl!)}
              />
            ) : (
              <Icon name="store" size={26} />
            )}
          </span>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium text-emerald-700">
              Nhà hàng
            </p>
            <h2 className="truncate text-lg font-semibold text-slate-800">
              {selected?.restaurantName || 'Chọn nhà hàng'}
            </h2>
            {selected && (
              <p className="mt-1 break-words text-sm text-slate-500">
                {selected.address}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-end gap-3 lg:max-w-sm">
          <label className="block w-full space-y-2 sm:max-w-md">
            <span className="sr-only">Nhà hàng</span>
            <select
              aria-label="Nhà hàng"
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              disabled={restaurants.isPending}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
            >
              <option value="">
                {restaurants.isPending ? 'Đang tải nhà hàng…' : 'Chọn nhà hàng'}
              </option>
              {items.map((item) => (
                <option key={item.restaurantId} value={item.restaurantId}>
                  {item.restaurantName}
                </option>
              ))}
            </select>
          </label>
          {restaurants.hasNextPage && (
            <button
              type="button"
              disabled={restaurants.isFetching}
              onClick={() => void restaurants.fetchNextPage()}
              className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm text-emerald-700 disabled:opacity-40"
            >
              {restaurants.isFetchingNextPage
                ? 'Đang tải…'
                : 'Tải thêm nhà hàng'}
            </button>
          )}
        </div>
        {restaurants.isError && (
          <div role="alert" className="mt-3 text-sm text-rose-600">
            {restaurantError(restaurants.error)}{' '}
            <button
              type="button"
              onClick={() =>
                void (restaurants.isFetchNextPageError
                  ? restaurants.fetchNextPage()
                  : restaurants.refetch())
              }
              className="underline"
            >
              Thử lại
            </button>
          </div>
        )}
        {restaurants.isSuccess && !items.length && (
          <p className="mt-3 text-sm text-slate-500">
            Chưa có nhà hàng. Hãy thêm nhà hàng trước khi phân công.
          </p>
        )}
      </div>
      {selected ? (
        <RestaurantStaffSection
          key={restaurantId}
          restaurantId={restaurantId}
        />
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-16 text-center">
          <span className="mb-4 rounded-2xl bg-emerald-50 p-4 text-emerald-700">
            <Icon name="users" size={28} />
          </span>
          <h2 className="font-semibold text-slate-700">
            Chọn nhà hàng để phân công
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Danh sách nhân viên sẽ hiển thị tại đây.
          </p>
        </div>
      )}
    </>
  )
}
