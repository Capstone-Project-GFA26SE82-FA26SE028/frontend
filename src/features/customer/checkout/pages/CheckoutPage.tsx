import { Link, Navigate } from 'react-router-dom'
import { useCustomerCart } from '../../cart/hooks/useCustomerCart'
import { CartStatus } from '../../cart/components/CartStatus'
import { CartSummary } from '../../cart/components/CartSummary'
import { canReviewCart } from '../../cart/cartHelpers'
import { CheckoutOrderReview } from '../components/CheckoutOrderReview'
export function CheckoutPage() {
  const m = useCustomerCart()
  const cart = m.cart.data
  if (cart?.items.length && !canReviewCart(cart))
    return <Navigate to="/cart" replace />
  return (
    <section className="py-6 pb-12">
      <p className="eyebrow">Selected for your table</p>
      <h1 className="mt-2 text-4xl font-bold">Review your order</h1>
      <CartStatus management={m} />
      {cart &&
        !m.cart.isError &&
        (cart.items.length ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <CheckoutOrderReview cart={cart} tableCode={m.table?.tableCode} />
            <CartSummary
              total={cart.quote?.totalAmount ?? null}
              count={cart.items.reduce((sum, line) => sum + line.quantity, 0)}
              tableCode={m.table?.tableCode}
            >
              <button className="btn-primary w-full" disabled>
                Place order
              </button>
              <p className="mt-3 text-xs leading-5 text-muted">
                Online order submission is currently unavailable. Please ask
                your server to place your order.
              </p>
            </CartSummary>
          </div>
        ) : (
          <div className="panel mt-8 p-8">
            <p>Your cart is empty.</p>
            <Link to="/menu" className="btn-primary mt-5">
              Choose dishes
            </Link>
          </div>
        ))}
    </section>
  )
}
