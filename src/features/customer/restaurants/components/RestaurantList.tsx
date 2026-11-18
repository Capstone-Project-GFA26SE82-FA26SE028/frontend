import { useRef, useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { restaurantError } from '../api/restaurantApi'
import { useOnlineRestaurants } from '../hooks/useOnlineRestaurants'
import type { OnlineRestaurant } from '../types/types'
import { RestaurantCard } from './RestaurantCard'

export function RestaurantList() {
  const m = useOnlineRestaurants()
  const section = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<OnlineRestaurant | null>(null)
  const data = m.restaurants.data
  const phone = selected?.hotline.replace(/[^\d+]/g, '') || ''
  return (
    <section
      ref={section}
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
        {m.restaurants.isSuccess && data && (
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-brand">
            {data.totalCount} nhà hàng
          </span>
        )}
      </div>
      {m.restaurants.isPending ? (
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
      ) : m.restaurants.isError ? (
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
      ) : !data?.items.length ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-mint/30 px-5 py-12 text-center">
          <Icon name="store" size={32} className="mx-auto text-brand" />
          <p className="mt-4 font-semibold">Chưa có nhà hàng</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((restaurant) => (
              <RestaurantCard
                key={restaurant.restaurantId}
                restaurant={restaurant}
                onView={() => setSelected(restaurant)}
              />
            ))}
          </div>
          {data.totalCount > m.pageSize && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200/70 bg-white">
              <Pagination
                total={data.totalCount}
                page={m.page}
                size={m.pageSize}
                onPage={(page) => {
                  setSelected(null)
                  m.setPage(page)
                  section.current?.scrollIntoView({
                    behavior: window.matchMedia(
                      '(prefers-reduced-motion: reduce)',
                    ).matches
                      ? 'instant'
                      : 'smooth',
                    block: 'start',
                  })
                }}
              />
            </div>
          )}
        </>
      )}
      {selected && (
        <Modal
          title={selected.restaurantName}
          onClose={() => setSelected(null)}
        >
          <div className="space-y-5 p-6">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="mb-1.5 flex items-center gap-2 text-xs text-muted">
                  <Icon name="pin" size={15} />
                  Địa chỉ
                </dt>
                <dd className="break-words font-medium">
                  {selected.address || 'Chưa cập nhật'}
                </dd>
              </div>
              <div>
                <dt className="mb-1.5 flex items-center gap-2 text-xs text-muted">
                  <Icon name="phone" size={15} />
                  Hotline
                </dt>
                <dd>
                  {phone ? (
                    <a
                      href={'tel:' + phone}
                      className="font-semibold text-brand hover:underline"
                    >
                      {selected.hotline}
                    </a>
                  ) : (
                    'Chưa cập nhật'
                  )}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="btn-secondary w-full"
            >
              Đóng
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}
