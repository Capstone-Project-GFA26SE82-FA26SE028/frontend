import { formatCurrency } from '../../../../utils/currency'
import type { CustomerOrder } from '../types/types'
import { OrderStatusBadge } from './OrderStatusBadge'

const orderSteps = [
  'Waiting',
  'Confirmed',
  'Cooking',
  'Ready',
  'Served',
]

function getCurrentStep(order: CustomerOrder) {
  if (order.status === 'Cancelled') return -1
  if (order.status === 'PendingConfirmation') return 0
  const activeItems = order.items.filter((item) => item.status !== 'Cancelled')
  if (!activeItems.length) return -1
  const stepByStatus: Record<string, number> = {
    PendingConfirmation: 0,
    Pending: 1,
    Hold: 1,
    Cooking: 2,
    Ready: 3,
    Served: 4,
  }
  // Mixed orders follow the least advanced dish; cancelled dishes are excluded.
  return Math.min(...activeItems.map((item) => stepByStatus[item.status] ?? -1))
}

export function OrderTrackingCard({
  order,
  tableCode,
}: {
  order: CustomerOrder
  tableCode?: string
}) {
  const progress = getCurrentStep(order)
  return (
    <article className="panel min-w-0 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="break-all text-sm font-bold sm:text-base">
            {order.orderNumber}
          </h2>
          <p className="mt-2 text-xs text-muted">
            {new Date(order.createdAt).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
            {tableCode ? ' · Table ' + tableCode : ''}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      {progress >= 0 && (
        <ol
          aria-label="Order progress"
          className="my-6 grid grid-cols-5 gap-1.5 sm:gap-2"
        >
          {orderSteps.map((label, index) => (
            <li
              key={label}
              aria-current={index === progress ? 'step' : undefined}
              className={
                'text-center text-[10px] leading-4 sm:text-xs ' +
                (index <= progress ? 'font-medium text-brand' : 'text-muted')
              }
            >
              <div
                className={
                  'mb-2 h-1.5 rounded-full ' +
                  (index <= progress ? 'bg-brand' : 'bg-stone-100')
                }
              />
              {label}
            </li>
          ))}
        </ol>
      )}
      <div className="mt-5 divide-y divide-stone-100 border-y border-stone-100">
        {order.items.map((item) => (
          <div key={item.orderItemId} className="flex gap-3 py-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 break-words text-sm font-semibold">
                  {item.quantity} x {item.nameSnapshot}
                </p>
                <span className="shrink-0 text-sm font-semibold">
                  {formatCurrency(item.lineTotal)}
                </span>
              </div>
              {item.options.map((option) => (
                <p key={option.optionId} className="mt-1 text-xs text-muted">
                  {option.name}
                  {option.quantity > 1 ? ' x ' + option.quantity : ''}
                </p>
              ))}
              {item.note && (
                <p className="mt-1 break-words text-xs text-muted">
                  Note: {item.note}
                </p>
              )}
              <div className="mt-2">
                <OrderStatusBadge status={item.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between gap-3 text-sm font-bold">
        <span>Order total</span>
        <span>{formatCurrency(order.totalAmount)}</span>
      </div>
      {order.status === 'PendingConfirmation' && (
        <p className="mt-3 text-xs text-muted">
          Staff will confirm your order shortly.
        </p>
      )}
      {order.status === 'Confirmed' && progress === 1 && (
        <p className="mt-3 text-xs text-muted">
          Your order is confirmed and queued for the kitchen.
        </p>
      )}
    </article>
  )
}
