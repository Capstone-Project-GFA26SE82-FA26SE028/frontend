import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import type { usePlatformDashboard } from '../hooks/usePlatformDashboard'

export function PlatformRestaurants({
  restaurants,
}: Pick<ReturnType<typeof usePlatformDashboard>, 'restaurants'>) {
  const [failedLogos, setFailedLogos] = useState<string[]>([])

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2.5 font-semibold text-slate-800">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Icon name="store" size={19} />
          </span>
          Nhà hàng trên nền tảng
        </h2>
        <Link
          to="restaurants"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
        >
          Xem tất cả <Icon name="arrow" size={15} />
        </Link>
      </div>
      {restaurants.isPending ? (
        <p role="status" className="text-sm text-slate-500">
          Đang tải nhà hàng…
        </p>
      ) : restaurants.isError ? (
        <div className="text-sm">
          <p role="alert" className="text-rose-700">
            Không tải được danh sách nhà hàng.
          </p>
          <button
            type="button"
            onClick={() => void restaurants.refetch()}
            className="mt-2 text-emerald-700 underline"
          >
            Thử lại
          </button>
        </div>
      ) : restaurants.data.items.length ? (
        <ul className="divide-y divide-slate-100">
          {restaurants.data.items.map(
            ({ restaurantId, restaurantName, address, logoUrl }) => (
              <li
                key={restaurantId}
                className="flex min-w-0 items-center gap-3 px-1 py-2.5"
              >
                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-emerald-50 text-emerald-700">
                  {logoUrl &&
                  /^https?:\/\//i.test(logoUrl) &&
                  !failedLogos.includes(logoUrl) ? (
                    <img
                      src={logoUrl}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="size-full object-cover"
                      onError={() =>
                        setFailedLogos((previous) => [...previous, logoUrl])
                      }
                    />
                  ) : (
                    <Icon name="store" size={21} />
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-semibold text-slate-800"
                    title={restaurantName}
                  >
                    {restaurantName}
                  </p>
                  <p
                    className="mt-1 line-clamp-2 text-xs text-slate-500"
                    title={address}
                  >
                    {address}
                  </p>
                </div>
              </li>
            ),
          )}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">Chưa có nhà hàng.</p>
      )}
    </section>
  )
}
