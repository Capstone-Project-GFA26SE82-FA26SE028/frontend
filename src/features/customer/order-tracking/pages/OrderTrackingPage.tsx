import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { OrderTrackingCard } from '../components/OrderTrackingCard'
import { useOrderTracking } from '../hooks/useOrderTracking'
import { orderTrackingError } from '../api/orderTrackingApi'

export function OrderTrackingPage() {
  const { table, orders, query } = useOrderTracking()
  return (
    <section className="pt-1 pb-8">
      <div className="grid min-h-11 grid-cols-[64px_minmax(0,1fr)_64px] items-center gap-2">
        <Link
          to="/menu"
          aria-label="Quay lại thực đơn"
          title="Quay lại thực đơn"
          className="inline-flex size-9 items-center justify-center justify-self-start rounded-lg border border-stone-200/70 bg-white text-muted transition-colors hover:bg-mint hover:text-brand"
        >
          <Icon name="chevron" size={20} className="rotate-180" />
        </Link>
        <h1 className="text-center text-base font-medium">Đơn của bạn</h1>
        <button
          className="min-h-9 rounded-lg bg-mint px-2 text-xs text-brand transition-colors hover:bg-brand/10 disabled:opacity-45"
          aria-label={query.isFetching ? 'Đang cập nhật đơn' : 'Làm mới'}
          aria-busy={query.isFetching}
          disabled={query.isFetching || !table}
          onClick={() => void query.refetch()}
        >
          Làm mới
        </button>
      </div>
      {query.isPending && (
        <p role="status" className="mt-4 text-muted">
          Đang tải đơn gọi món…
        </p>
      )}
      {query.isError && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <p>{orderTrackingError(query.error)}</p>
          {orders.length > 0 && (
            <p className="mt-1">
              Đang hiển thị dữ liệu đã tải trước đó. Trạng thái đơn có thể đã
              thay đổi.
            </p>
          )}
        </div>
      )}
      {orders.length > 0 ? (
        <div className="mt-4">
          <div className="min-w-0 space-y-5">
            {orders.map((order) => (
              <OrderTrackingCard
                key={order.orderId}
                order={order}
                tableCode={table?.tableCode}
              />
            ))}
            {query.hasNextPage && (
              <button
                className="btn-secondary w-full"
                disabled={query.isFetching}
                onClick={() => void query.fetchNextPage()}
              >
                {query.isFetchingNextPage ? 'Đang tải…' : 'Xem đơn trước đó'}
              </button>
            )}
          </div>
        </div>
      ) : (
        query.isSuccess && (
          <div className="panel mt-4 px-5 py-14 text-center">
            <Icon name="receipt" size={36} className="mx-auto text-brand" />
            <h2 className="mt-5 text-xl font-bold">Chưa có đơn gọi món</h2>
            <p className="mt-2 text-sm text-muted">
              Các đơn bạn đã gửi sẽ xuất hiện tại đây.
            </p>
            <Link to="/menu" className="btn-primary mt-6">
              Xem thực đơn
            </Link>
          </div>
        )
      )}
    </section>
  )
}
