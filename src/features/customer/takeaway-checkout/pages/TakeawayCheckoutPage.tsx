import { useState, type FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { HomeHeader } from '../../../../components/HomeHeader/HomeHeader'
import { NotFoundPage } from '../../../../pages/NotFoundPage'
import { formatCurrency } from '../../../../utils/currency'
import { takeawayOrderError } from '../api/takeawayOrderApi'
import { saveTakeawayPaymentReturn } from '../utils/takeawayPaymentReturn'
import { useTakeawayCheckout, useTakeawayOrder } from '../hooks/useTakeawayCheckout'

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function TakeawayCheckoutPage() {
  const { restaurantId = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const user = useAppSelector((state) => state.auth.session?.user)
  const orderId = params.get('order')
  if (!idPattern.test(restaurantId) || (orderId !== null && !idPattern.test(orderId)))
    return <NotFoundPage />

  const restaurant = restaurantId.toLowerCase()
  const basePath = `/restaurants/${restaurant}`
  return (
    <div className="min-h-dvh bg-[#faf9f6] text-[#173e32]" lang="vi">
      <HomeHeader />
      <main className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6">
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-semibold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          to={orderId ? '/takeaway-orders' : basePath + '/cart'}
        >
          <Icon name="chevron" size={16} className="rotate-180" />
          {orderId ? 'Về đơn của tôi' : 'Về giỏ hàng'}
        </Link>
        <h1 className="mb-5 mt-3 text-2xl font-bold">{orderId ? 'Đơn mang đi' : 'Đặt món mang đi'}</h1>
        {orderId ? (
          <TakeawayPayment key={orderId} restaurantId={restaurant} orderId={orderId} userId={user?.userId} />
        ) : (
          <PickupForm
            key={`${user?.userId}:${restaurant}`}
            restaurantId={restaurant}
            userId={user?.userId}
            onCreated={(id) => setParams({ order: id }, { replace: true })}
          />
        )}
      </main>
    </div>
  )
}

function PickupForm({ restaurantId, userId, onCreated }: {
  restaurantId: string
  userId?: string
  onCreated: (orderId: string) => void
}) {
  const [pickupName, setPickupName] = useState('')
  const [pickupPhone, setPickupPhone] = useState('')
  const [validationError, setValidationError] = useState('')
  const { cart, quote, canOrder, pending, error, retrying, submitOrder } =
    useTakeawayCheckout(restaurantId, userId, onCreated)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = pickupName.trim()
    const phone = pickupPhone.trim()
    if (!name || !/^\+?\d{8,19}$|^\d{20}$/.test(phone)) {
      setValidationError('Nhập tên và số điện thoại hợp lệ của người nhận món.')
      return
    }
    setValidationError('')
    void submitOrder(name, phone)
  }


  if (cart.isPending && !retrying) return <p role="status">Đang tải giỏ hàng…</p>

  return (
    <form className="panel space-y-5 p-5 sm:p-6" onSubmit={(event) => void submit(event)}>
      <h2 className="text-lg font-semibold">Thông tin nhận món</h2>
      <p className="text-sm text-muted">Thanh toán qua PayOS và đến nhà hàng nhận món.</p>
      <label className="block text-sm font-medium">
        Tên người nhận
        <input className="field mt-2" autoComplete="name" maxLength={100} required value={pickupName} onChange={(event) => setPickupName(event.target.value)} disabled={pending || retrying} />
      </label>
      <label className="block text-sm font-medium">
        Số điện thoại
        <input className="field mt-2" type="tel" autoComplete="tel" maxLength={20} required value={pickupPhone} onChange={(event) => setPickupPhone(event.target.value)} disabled={pending || retrying} />
      </label>
      {quote?.isValid && quote.totalAmount != null && (
        <div className="flex items-center justify-between gap-4 border-t border-stone-200 pt-4">
          <span>Tạm tính</span>
          <strong>{formatCurrency(quote.totalAmount)}</strong>
        </div>
      )}
      {!canOrder && !retrying && !cart.isFetching && (
        <p role="alert" className="text-sm text-amber-800">
          {cart.isError ? 'Chưa tải được giỏ hàng.' : quote?.message || 'Giỏ hàng chưa sẵn sàng để đặt món.'}
        </p>
      )}
      {(validationError || error) && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{validationError || error}</p>}
      <button className="btn-primary w-full" type="submit" disabled={pending || (!canOrder && !retrying)}>
        {pending ? 'Đang đặt món…' : retrying ? 'Thử lại yêu cầu đặt món' : 'Đặt món và thanh toán'}
      </button>
    </form>
  )
}

function TakeawayPayment({ restaurantId, orderId, userId }: { restaurantId: string; orderId: string; userId?: string }) {
  const order = useTakeawayOrder(restaurantId, orderId, userId)
  const detail = order.data
  const awaitingPayment = detail?.status === 'PendingPayment'
  const statusLabels: Record<string, string> = {
    PendingPayment: 'Chờ thanh toán',
    PendingConfirmation: 'Chờ nhà hàng xác nhận',
    Accepted: 'Đã xác nhận',
    Cooking: 'Đang chuẩn bị',
    ReadyForPickup: 'Sẵn sàng nhận món',
    Completed: 'Đã nhận món',
    Cancelled: 'Đã hủy',
    Rejected: 'Nhà hàng đã từ chối',
  }
  const checkoutUrl = awaitingPayment && /^https:\/\//i.test(detail.checkoutUrl ?? '') ? detail.checkoutUrl : null

  return (
    <section className="panel space-y-4 p-5 sm:p-6">
      {order.isPending && <p role="status">Đang tải đơn hàng…</p>}
      {order.isError && (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-rose-800">{takeawayOrderError(order.error)}</p>
          <button className="btn-secondary" type="button" disabled={order.isFetching} onClick={() => void order.refetch()}>
            Thử lại
          </button>
        </div>
      )}
      {detail && (
        <>
          <p className="break-all text-sm text-muted">{detail.orderNumber}</p>
          <h2 className="text-lg font-semibold">{statusLabels[detail.status] ?? 'Đang cập nhật trạng thái đơn'}</h2>
          {detail.paymentStatus === 'Paid' && <p className="text-sm font-medium text-emerald-800">Đã thanh toán</p>}
          {!!detail.items?.length && (
            <section className="border-t border-stone-100 pt-4">
              <h3 className="text-sm font-semibold">Món đã đặt</h3>
              <ul className="mt-1 divide-y divide-stone-100">
                {detail.items.map((item) => (
                  <li key={item.orderItemId} className="flex items-start justify-between gap-3 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="break-words font-medium">{item.quantity} × {item.nameSnapshot}</p>
                      {!!item.options.length && (
                        <p className="mt-1 text-muted">
                          {item.options.map((option) => option.quantity > 1 ? `${option.name} × ${option.quantity}` : option.name).join(', ')}
                        </p>
                      )}
                      {item.note && <p className="mt-1 break-words text-muted">Ghi chú: {item.note}</p>}
                    </div>
                    <span className="shrink-0 font-medium">{formatCurrency(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
            <span className="font-medium">Tổng tiền</span>
            <strong className="text-xl text-brand">{formatCurrency(detail.totalAmount)}</strong>
          </div>
          {detail.status === 'ReadyForPickup' && detail.pickupCode && (
            <p className="break-all rounded-xl bg-emerald-50 p-3 text-sm">Mã nhận món <strong>{detail.pickupCode}</strong></p>
          )}
          {checkoutUrl ? (
            <a
              className="btn-primary w-full"
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
                if (saveTakeawayPaymentReturn(restaurantId, orderId, userId)) {
                  event.preventDefault()
                  window.location.assign(checkoutUrl)
                }
              }}
            >
              Thanh toán qua PayOS
            </a>
          ) : awaitingPayment && (
            <p className="text-sm text-muted">Đang chờ đường dẫn thanh toán. Trang sẽ tự cập nhật.</p>
          )}
        </>
      )}
    </section>
  )
}