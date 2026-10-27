import { cartError } from '../api/cartApi'
import type { useCustomerCart } from '../hooks/useCustomerCart'
export function CartStatus({
  management: m,
}: {
  management: ReturnType<typeof useCustomerCart>
}) {
  if (m.cart.isPending)
    return (
      <p role="status" className="panel mt-6 p-8 text-center">
        Loading your cart...
      </p>
    )
  const error = m.cart.isError
    ? m.cart.error
    : m.mutation.isError
      ? m.mutation.error
      : null
  if (!error) return null
  return (
    <div
      role="alert"
      className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
    >
      <p>{cartError(error)}</p>
      <button
        disabled={m.pending || m.cart.isFetching}
        className="mt-2 font-semibold underline disabled:opacity-40"
        onClick={() => void m.reload()}
      >
        Reload cart
      </button>
    </div>
  )
}
