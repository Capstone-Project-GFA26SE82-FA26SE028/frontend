import { Icon } from '../../../../components/Icon/Icon'
import { restaurantError } from '../api/restaurantApi'
import { useOnlineRestaurants } from '../hooks/useOnlineRestaurants'
import { RestaurantCard } from './RestaurantCard'

export function RestaurantList() {
  const m = useOnlineRestaurants()
  const remaining = Math.max(0, m.totalCount - m.items.length)
  return (
    <section
      id="nha-hang"
      aria-labelledby="restaurant-list-title"
      className="scroll-mt-6 pb-4"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="restaurant-list-title"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Danh sách nhà hàng
          </h2>
        </div>
        {!m.isSearching && m.restaurants.data && (
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-brand">
            {m.totalCount} nhà hàng
          </span>
        )}
      </div>
      <div className="relative mb-6 max-w-md">
        <Icon
          name="search"
          size={19}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          aria-label="Tìm nhà hàng"
          placeholder="Tìm tên nhà hàng hoặc địa chỉ…"
          value={m.search}
          maxLength={200}
          onChange={(event) => {
            m.changeSearch(event.target.value)
          }}
          className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white py-3 pr-4 pl-11 text-sm outline-none transition-shadow placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      {m.isSearching ? (
        <div role="status" aria-label="Đang tải nhà hàng">
          <p className="mb-4 text-sm text-muted">Đang tải nhà hàng…</p>
          <div
            aria-hidden="true"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-80 rounded-3xl border border-stone-100 bg-white motion-safe:animate-pulse"
              >
                <div className="h-40 rounded-t-3xl bg-stone-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 rounded bg-stone-100" />
                  <div className="h-3 rounded bg-stone-50" />
                  <div className="h-3 w-1/2 rounded bg-stone-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : m.restaurants.isError && !m.restaurants.data ? (
        <div className="rounded-3xl border border-stone-200/70 bg-white px-5 py-10 text-center">
          <p role="alert" className="text-sm text-muted">
            {restaurantError(m.restaurants.error)}
          </p>
          <button
            type="button"
            onClick={() => void m.restaurants.refetch()}
            className="btn-secondary mt-4 gap-2"
          >
            <Icon name="refresh" size={17} />
            Thử lại
          </button>
        </div>
      ) : !m.items.length ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-mint/30 px-5 py-12 text-center">
          <Icon name="store" size={32} className="mx-auto text-brand" />
          <p className="mt-4 font-semibold">
            {m.search.trim()
              ? 'Không tìm thấy nhà hàng phù hợp'
              : 'Chưa có nhà hàng'}
          </p>
          {m.search.trim() && (
            <button
              type="button"
              onClick={() => m.changeSearch('')}
              className="mt-3 text-sm font-semibold text-brand hover:underline"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {m.items.map((restaurant) => (
              <RestaurantCard
                key={restaurant.restaurantId}
                restaurant={restaurant}
              />
            ))}
          </div>
          {m.restaurants.hasNextPage && (
            <div className="mt-6">
              {m.restaurants.isFetchNextPageError && (
                <p
                  role="alert"
                  className="mb-3 text-center text-sm text-rose-700"
                >
                  {restaurantError(m.restaurants.error)}
                </p>
              )}
              <button
                type="button"
                disabled={m.restaurants.isFetching}
                onClick={() => void m.restaurants.fetchNextPage()}
                className="min-h-12 w-full rounded-full border border-emerald-900/20 bg-white px-5 py-3 text-sm font-semibold text-brand transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
              >
                {m.restaurants.isFetchingNextPage
                  ? 'Đang tải thêm…'
                  : m.restaurants.isFetchNextPageError
                    ? 'Thử tải lại'
                    : `Xem thêm ${remaining} quán`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
