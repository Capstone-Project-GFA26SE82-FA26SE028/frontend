import { useOrderTracking } from '../../order-tracking/hooks/useOrderTracking'
import { usePaymentRequest } from '../hooks/usePaymentRequest'

const statusLabels = {
  Requested: 'Đã gửi yêu cầu tính tiền. Bạn chờ một chút nhé!',
  Acknowledged: 'Nhân viên đã tiếp nhận yêu cầu tính tiền.',
  Completed: 'Yêu cầu tính tiền đã hoàn tất.',
}

export function PaymentRequestOption({ sessionId }: { sessionId: string }) {
  const { query, send } = usePaymentRequest(sessionId)
  const { orders, query: ordersQuery } = useOrderTracking(
    query.isSuccess && !query.data,
  )
  const status = query.data?.status

  return (
    <div className="space-y-2 border-t border-stone-200 pt-4">
      {status && (
        <p role="status" className="rounded-xl bg-mint p-3 text-sm text-brand">
          {statusLabels[status]}
        </p>
      )}
      {query.isPending && (
        <p role="status" className="text-sm text-muted">
          Đang kiểm tra yêu cầu tính tiền…
        </p>
      )}
      {query.isError && (
        <>
          <p role="alert" className="text-sm text-rose-700">
            Không thể kiểm tra yêu cầu tính tiền.
          </p>
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={() => void query.refetch()}
          >
            Thử lại
          </button>
        </>
      )}
      {query.isSuccess && !status && (
        <>
          {ordersQuery.isError && (
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => void ordersQuery.refetch()}
            >
              Tải lại đơn gọi món
            </button>
          )}
          <button
            type="button"
            className="btn-secondary w-full"
            disabled={orders.length === 0 || send.isPending || query.isFetching}
            onClick={() => send.mutate()}
          >
            {send.isPending ? 'Đang gửi…' : 'Yêu cầu tính tiền'}
          </button>
          {ordersQuery.isSuccess && orders.length === 0 && (
            <p className="text-sm text-muted">Bàn chưa có đơn gọi món.</p>
          )}
          {send.isError && (
            <p role="alert" className="text-sm text-rose-700">
              Không thể gửi yêu cầu tính tiền. Vui lòng thử lại.
            </p>
          )}
        </>
      )}
    </div>
  )
}
