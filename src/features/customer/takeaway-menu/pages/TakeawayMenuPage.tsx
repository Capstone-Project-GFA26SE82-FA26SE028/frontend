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
import { useTakeawayCart } from '../../takeaway-cart/hooks/useTakeawayCart'

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
  const cart = useTakeawayCart(restaurantId, m.restaurant.isSuccess)
  const count =
    cart.cart.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  return (
    <div lang="vi" className="min-h-dvh bg-[#faf9f6] text-[#173e32]">
      <HomeHeader />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-8">
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
      {m.restaurant.isSuccess && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-[#faf9f6]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
          <Link
            to={'/restaurants/' + restaurantId + '/cart'}
            className="mx-auto flex min-h-12 max-w-lg items-center justify-between gap-3 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            <span className="flex items-center gap-2">
              <Icon name="bag" size={18} />
              Giỏ mang đi{count > 0 ? ' (' + count + ')' : ''}
            </span>
            <span>
              {cart.cart.data?.quote?.isValid &&
              cart.cart.data.quote.totalAmount !== null
                ? cart.cart.data.quote.totalAmount.toLocaleString('vi-VN') +
                  ' đ'
                : 'Xem giỏ'}{' '}
              →
            </span>
          </Link>
        </div>
      )}
      {m.selected && (
        <TakeawayDishDetail
          key={m.selected.itemId}
          dish={m.selected}
          onClose={() => {
            if (!cart.pending) m.setSelectedId(null)
          }}
          onAdd={async (line) => {
            if (await cart.addItem(line)) m.setSelectedId(null)
          }}
          pending={cart.pending}
          disabled={
            !cart.cart.data ||
            cart.cart.isFetching ||
            cart.cart.isError ||
            cart.needsReload
          }
          cartError={
            cart.error ||
            (cart.needsReload
              ? 'Giỏ hàng cần được tải lại trước khi thêm món.'
              : '')
          }
          cartLoading={cart.cart.isFetching || cart.cart.isPending}
          onReload={() => void cart.reload()}
        />
      )}
    </div>
  )
}
