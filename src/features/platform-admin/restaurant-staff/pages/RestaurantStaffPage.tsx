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
      <div className="mb-5 grid items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(13rem,17rem)] sm:gap-x-6 sm:p-5">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
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
            <h2 className="break-words text-lg font-semibold leading-tight text-slate-900">
              {selected?.restaurantName || 'Chọn nhà hàng'}
            </h2>
            {selected && (
              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-600">
                <Icon
                  name="pin"
                  size={15}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <span className="min-w-0 break-words">{selected.address}</span>
              </p>
            )}
          </div>
        </div>
        <div className="min-w-0 space-y-2">
          <label className="relative block">
            <span className="sr-only">Chọn nhà hàng</span>
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              disabled={restaurants.isPending}
              className="min-h-11 w-full cursor-pointer appearance-none truncate rounded-xl border border-emerald-100 bg-emerald-50/70 py-2 pl-3 pr-9 text-sm font-medium text-emerald-950 outline-none hover:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-default disabled:opacity-50"
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
            <Icon
              name="chevron"
              size={15}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rotate-90 text-emerald-700"
            />
          </label>
          {restaurants.hasNextPage && (
            <button
              type="button"
              disabled={restaurants.isFetching}
              onClick={() => void restaurants.fetchNextPage()}
              className="min-h-9 px-1 text-sm font-medium text-emerald-700 hover:underline disabled:opacity-40"
            >
              {restaurants.isFetchingNextPage
                ? 'Đang tải…'
                : 'Tải thêm nhà hàng'}
            </button>
          )}
        </div>
        {restaurants.isError && (
          <div role="alert" className="text-sm text-rose-600 sm:col-span-2">
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
          restaurantName={selected.restaurantName}
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
