import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { CartStatus } from '../../cart/components/CartStatus'
import { CartSummary } from '../../cart/components/CartSummary'
import { canReviewCart } from '../../cart/cartHelpers'
import { CheckoutOrderReview } from '../components/CheckoutOrderReview'
import { CheckoutReceipt } from '../components/CheckoutReceipt'
import { useCheckout } from '../hooks/useCheckout'
import { checkoutError, isOrderRejected } from '../api/checkoutApi'
import { Icon } from '../../../../components/Icon/Icon'
export function CheckoutPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  return orderId ? <CheckoutReceipt orderId={orderId} /> : <CheckoutReview />
}
function CheckoutReview() {
  const checkout = useCheckout()
  const m = checkout.management
  const cart = m.cart.data
  if (!checkout.attempt && cart?.items.length && !canReviewCart(cart))
    return <Navigate to="/cart" replace />
  return (
    <section className="pt-1 pb-8">
      <div className="grid min-h-11 grid-cols-[64px_minmax(0,1fr)_64px] items-center gap-2">
        <Link
          to="/cart"
          aria-label="Back to cart"
          title="Back to cart"
          className="inline-flex size-9 items-center justify-center justify-self-start rounded-lg border border-stone-200/70 bg-white text-muted transition-colors hover:bg-mint hover:text-brand"
        >
          <Icon name="chevron" size={20} className="rotate-180" />
        </Link>
        <h1 className="text-center text-base font-medium">Review your order</h1>
        <span aria-hidden="true" />
      </div>
      <CartStatus management={m} />
      {!checkout.attempt && checkout.localError && (
        <p role="alert" className="mt-4 text-red-600">
          {checkout.localError}
        </p>
      )}
      {checkout.attempt && (
        <div className="panel mt-6 p-5">
          <p role="status">
            {checkout.mutation.isError
              ? checkoutError(checkout.mutation.error)
              : 'An order request is saved. Check its result before placing another order.'}
          </p>
          <button
            className="btn-primary mt-4"
            disabled={m.pending || m.cart.isFetching}
            onClick={() => void checkout.placeOrder()}
          >
            {m.pending ? 'Submitting...' : 'Check / retry order'}
          </button>
          {isOrderRejected(checkout.mutation.error) && (
            <button
              className="btn-secondary ml-3 mt-4"
              disabled={m.pending}
              onClick={() => void checkout.reviewAgain()}
            >
              Reload and review cart
            </button>
          )}
        </div>
      )}
      {cart &&
        !m.cart.isError &&
        (cart.items.length && !checkout.attempt ? (
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <CheckoutOrderReview cart={cart} tableCode={m.table?.tableCode} />
            <CartSummary
              total={cart.quote?.totalAmount ?? null}
              count={cart.items.reduce((sum, line) => sum + line.quantity, 0)}
              tableCode={m.table?.tableCode}
            >
              <button
                className="btn-primary w-full"
                disabled={m.pending || m.cart.isFetching || m.mutation.isError}
                onClick={() => void checkout.placeOrder()}
              >
                Place order
              </button>
              <p className="mt-3 text-xs leading-5 text-muted">
                Your order will be sent to staff for confirmation.
              </p>
            </CartSummary>
          </div>
        ) : !checkout.attempt ? (
          <div className="panel mt-4 p-8">
            <p>Your cart is empty.</p>
            <Link to="/menu" className="btn-primary mt-5">
              Choose dishes
            </Link>
          </div>
        ) : null)}
    </section>
  )
}
