import { Link, useParams } from 'react-router-dom'
import { HomeHeader } from '../../../../components/HomeHeader/HomeHeader'
import { Icon } from '../../../../components/Icon/Icon'
import { NotFoundPage } from '../../../../pages/NotFoundPage'
import { restaurantError } from '../../restaurants/api/restaurantApi'
import { useTakeawayMenu } from '../hooks/useTakeawayMenu'
import { TakeawayMenuBanner } from '../components/TakeawayMenuBanner'
import { TakeawayMenuFilters } from '../components/TakeawayMenuFilters'
import { TakeawayDishList } from '../components/TakeawayDishList'
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
            <TakeawayMenuBanner
              name={m.restaurant.data.restaurantName}
              address={m.restaurant.data.address}
            />
            <TakeawayMenuFilters
              search={m.search}
              category={m.category}
              categories={m.categories}
              onSearch={m.setSearch}
              onCategory={m.setCategory}
            />
            <TakeawayDishList
              dishes={m.visible}
              loading={m.menu.isPending}
              error={m.menu.isError ? m.menu.error : null}
              filtered={!!(m.search.trim() || m.category)}
              onRetry={() => void m.menu.refetch()}
              onClear={() => {
                m.setSearch('')
                m.setCategory('')
              }}
              onView={m.setSelectedId}
            />
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
