import { Link, useParams } from 'react-router-dom'
import { HomeHeader } from '../../../../components/HomeHeader/HomeHeader'
import { Icon } from '../../../../components/Icon/Icon'
import { NotFoundPage } from '../../../../pages/NotFoundPage'
import { restaurantError } from '../../restaurants/api/restaurantApi'
import { useTakeawayMenu } from '../hooks/useTakeawayMenu'
import { TakeawayDishCard } from '../components/TakeawayDishCard'
import { TakeawayDishDetail } from '../components/TakeawayDishDetail'

export function TakeawayMenuPage() {
  const { restaurantId = '' } = useParams()
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      restaurantId,
    )
  )
    return <NotFoundPage />
  return (
    <TakeawayMenu
      key={restaurantId}
      restaurantId={restaurantId.toLowerCase()}
    />
  )
}

function TakeawayMenu({ restaurantId }: { restaurantId: string }) {
  const m = useTakeawayMenu(restaurantId)
  return (
    <div lang="vi" className="min-h-dvh bg-[#faf9f6] text-[#173e32]">
      <HomeHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <Link
          to="/restaurants"
          className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-brand"
        >
          <Icon name="arrow" size={16} className="rotate-180" />
          Chọn nhà hàng khác
        </Link>
        {m.restaurant.isPending ? (
          <p role="status" className="py-12 text-center">
            Đang tải nhà hàng…
          </p>
        ) : m.restaurant.isError ? (
          <div className="rounded-2xl bg-white p-6">
            <p role="alert">{restaurantError(m.restaurant.error)}</p>
            <button
              type="button"
              onClick={() => void m.restaurant.refetch()}
              className="btn-secondary mt-4"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <section className="mb-7 rounded-3xl bg-[#164B3B] px-6 py-7 text-white sm:px-9">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#d7e9b7]">
                <Icon name="bag" size={16} />
                Thực đơn mang đi
              </p>
              <h1 className="break-words text-3xl font-bold">
                {m.restaurant.data.restaurantName}
              </h1>
              {m.restaurant.data.address && (
                <p className="mt-3 flex items-start gap-2 text-sm text-white/75">
                  <Icon name="pin" size={16} className="shrink-0" />
                  {m.restaurant.data.address}
                </p>
              )}
            </section>
            <div className="relative mb-5 max-w-md">
              <Icon
                name="search"
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                aria-label="Tìm món"
                placeholder="Tìm món bạn muốn ăn…"
                maxLength={255}
                value={m.search}
                onChange={(event) => m.setSearch(event.target.value)}
                className="field pl-11"
              />
            </div>
            <div
              role="group"
              aria-label="Danh mục món"
              className="mb-6 flex flex-wrap gap-2"
            >
              <button
                type="button"
                aria-pressed={!m.category}
                onClick={() => m.setCategory('')}
                className={
                  'rounded-full px-4 py-2.5 text-sm font-semibold ' +
                  (!m.category
                    ? 'bg-brand text-white'
                    : 'border border-stone-200 bg-white')
                }
              >
                Tất cả món
              </button>
              {m.categories.map(([id, name]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={m.category === id}
                  onClick={() => m.setCategory(id)}
                  className={
                    'rounded-full px-4 py-2.5 text-sm font-semibold ' +
                    (m.category === id
                      ? 'bg-brand text-white'
                      : 'border border-stone-200 bg-white')
                  }
                >
                  {name}
                </button>
              ))}
            </div>
            {m.menu.isPending ? (
              <p role="status" className="py-12 text-center">
                Đang tải thực đơn…
              </p>
            ) : m.menu.isError ? (
              <div className="rounded-2xl bg-white p-6">
                <p role="alert">{restaurantError(m.menu.error)}</p>
                <button
                  type="button"
                  onClick={() => void m.menu.refetch()}
                  className="btn-secondary mt-4"
                >
                  Thử lại
                </button>
              </div>
            ) : !m.visible.length ? (
              <div className="rounded-3xl border border-dashed border-emerald-200 p-10 text-center">
                <Icon
                  name="utensils"
                  size={32}
                  className="mx-auto text-brand"
                />
                <p className="mt-4">
                  {m.search.trim() || m.category
                    ? 'Không tìm thấy món phù hợp.'
                    : 'Nhà hàng chưa có món trong thực đơn.'}
                </p>
                {(m.search.trim() || m.category) && (
                  <button
                    type="button"
                    onClick={() => {
                      m.setSearch('')
                      m.setCategory('')
                    }}
                    className="mt-3 text-sm font-semibold text-brand"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-muted">
                  {m.visible.length} món
                </p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {m.visible.map((dish) => (
                    <TakeawayDishCard
                      key={dish.itemId}
                      dish={dish}
                      onView={() => m.setSelectedId(dish.itemId)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      {m.selected && (
        <TakeawayDishDetail
          dish={m.selected}
          onClose={() => m.setSelectedId(null)}
        />
      )}
    </div>
  )
}
