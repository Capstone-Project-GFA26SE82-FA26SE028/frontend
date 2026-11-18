import { TakeawayCartList } from '../components/TakeawayCartList'
import { TakeawayCartSummary } from '../components/TakeawayCartSummary'
import { TakeawayCartEditModal } from '../components/TakeawayCartEditModal'
import { TakeawayCartClearModal } from '../components/TakeawayCartClearModal'

import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { TakeawayCartEditTarget } from '../types/types'
import { HomeHeader } from '../../../../components/HomeHeader/HomeHeader'
import { Icon } from '../../../../components/Icon/Icon'
import { NotFoundPage } from '../../../../pages/NotFoundPage'
import { getAllOnlineRestaurants } from '../../restaurants/api/restaurantApi'
import { useTakeawayCart } from '../hooks/useTakeawayCart'

export function TakeawayCartPage() {
  const { restaurantId = '' } = useParams()
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      restaurantId,
    )
  )
    return <NotFoundPage />
  return (
    <TakeawayCartContent
      key={restaurantId}
      restaurantId={restaurantId.toLowerCase()}
    />
  )
}

function TakeawayCartContent({ restaurantId }: { restaurantId: string }) {
  const model = useTakeawayCart(restaurantId)
  const cart = model.cart.data
  const [editing, setEditing] = useState<TakeawayCartEditTarget | null>(null)
  const [confirm, setConfirm] = useState<{
    index: number | null
    version: string
  } | null>(null)
  const blocked =
    model.pending ||
    model.cart.isFetching ||
    model.needsReload ||
    model.cart.isError
  const restaurant = useQuery({
    queryKey: ['online-restaurant', restaurantId],
    queryFn: async ({ signal }) => {
      const list = await getAllOnlineRestaurants(signal)
      const found = list.items.find(
        (item) => item.restaurantId.toLowerCase() === restaurantId,
      )
      if (!found) throw new Error('Không tìm thấy nhà hàng.')
      return found
    },
    retry: false,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  return (
    <div
      lang="vi"
      className="flex min-h-dvh flex-col bg-[#faf9f6] text-[#173e32]"
    >
      <HomeHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8">
        <div className="mb-4 grid min-h-11 grid-cols-[64px_minmax(0,1fr)_64px] items-center gap-2">
          <Link
            to={'/restaurants/' + restaurantId + '/menu'}
            aria-label="Quay lại thực đơn"
            className="inline-flex size-9 items-center justify-center justify-self-start rounded-lg border border-stone-200/70 bg-white text-muted hover:bg-mint hover:text-brand"
          >
            <Icon name="chevron" size={20} className="rotate-180" />
          </Link>
          <h1 className="text-center text-base font-medium">
            Các món đang chọn
          </h1>
          {!!cart?.items.length && (
            <button
              type="button"
              disabled={blocked}
              onClick={() => setConfirm({ index: null, version: cart.version })}
              aria-label="Xóa giỏ"
              className="min-h-9 rounded-lg bg-red-50 px-2 text-xs text-red-500 hover:bg-red-100 disabled:opacity-45"
            >
              Xóa
            </button>
          )}
        </div>
        {restaurant.data && (
          <div className="mb-5 flex items-center gap-3 text-sm text-muted">
            <Icon name="store" size={22} className="shrink-0 text-brand" />
            <div className="min-w-0">
              <h2 className="break-words font-semibold">
                {restaurant.data.restaurantName}
              </h2>
            </div>
          </div>
        )}
        {model.error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"
          >
            <p>{model.error}</p>
            <button
              type="button"
              disabled={model.cart.isFetching}
              onClick={() => void model.reload()}
              className="mt-2 font-semibold underline underline-offset-4 disabled:opacity-40"
            >
              Tải lại giỏ hàng
            </button>
          </div>
        )}
        {model.cart.isPending ? (
          <p role="status" className="py-12 text-center">
            Đang tải giỏ hàng…
          </p>
        ) : cart && !cart.items.length ? (
          <section className="panel mt-4 px-6 py-12 text-center">
            <Icon name="bag" size={40} className="mx-auto text-brand/50" />
            <h2 className="mt-5 text-xl font-bold">Giỏ hàng đang trống</h2>
            <Link
              to={'/restaurants/' + restaurantId + '/menu'}
              className="btn-primary mt-6"
            >
              Xem thực đơn
            </Link>
          </section>
        ) : cart ? (
          <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
            <TakeawayCartList
              cart={cart}
              restaurantId={restaurantId}
              blocked={blocked}
              onEdit={setEditing}
              onChange={model.changeItems}
            />
            <TakeawayCartSummary cart={cart} />
          </div>
        ) : null}
      </main>
      {editing && (
        <TakeawayCartEditModal
          key={editing.version + ':' + editing.index}
          restaurantId={restaurantId}
          editing={editing}
          model={model}
          blocked={blocked}
          onClose={() => setEditing(null)}
        />
      )}
      {confirm && (
        <TakeawayCartClearModal
          confirm={confirm}
          model={model}
          blocked={blocked}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
