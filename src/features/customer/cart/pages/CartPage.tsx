import { CartEditModal } from '../components/CartEditModal'
import type { CartEditTarget } from '../types/types'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { CartStatus } from '../components/CartStatus'
import { useCustomerCart } from '../hooks/useCustomerCart'
import { quotedItem, canReviewCart } from '../cartHelpers'
export function CartPage() {
  const m = useCustomerCart()
  const [confirmClear, setConfirmClear] = useState(false)
  const [editing, setEditing] = useState<CartEditTarget | null>(null)
  const cart = m.cart.data
  const disabled =
    m.pending || m.cart.isFetching || m.cart.isError || m.mutation.isError
  return (
    <section className="py-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Selected for your table</p>
          <h1 className="mt-2 text-4xl font-bold">Your cart</h1>
        </div>
        {!!cart?.items.length && (
          <button
            className="btn-secondary"
            disabled={disabled}
            onClick={() => setConfirmClear(true)}
          >
            Clear cart
          </button>
        )}
      </div>
      {!confirmClear && <CartStatus management={m} />}
      {cart &&
        !m.cart.isError &&
        (cart.items.length ? (
          <>
            {cart.quote && !cart.quote.isValid && (
              <p
                role="alert"
                className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
              >
                {cart.quote.message ||
                  'Some dishes or options are no longer available. Review your cart before continuing.'}
              </p>
            )}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="panel px-5 sm:px-7">
                {cart.items.map((line, index) => (
                  <CartItem
                    key={cart.version + ':' + index}
                    line={line}
                    quote={quotedItem(cart, line)}
                    errors={
                      cart.quote?.errors
                        .filter((e) => e.lineIndex === index)
                        .map((e) => e.message) || []
                    }
                    onEdit={() =>
                      setEditing({
                        index,
                        line: {
                          ...line,
                          options: line.options.map((o) => ({ ...o })),
                        },
                        version: cart.version,
                      })
                    }
                    disabled={disabled}
                    onQuantity={(quantity) => {
                      void m
                        .save({
                          kind: 'quantity',
                          index,
                          quantity,
                          version: cart.version,
                        })
                        .catch(() => {})
                    }}
                    onRemove={() => {
                      void m
                        .save({ kind: 'remove', index, version: cart.version })
                        .catch(() => {})
                    }}
                  />
                ))}
                <Link
                  to="/menu"
                  className="my-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand"
                >
                  <Icon name="plus" size={18} />
                  Add more dishes
                </Link>
              </div>
              <CartSummary
                total={cart.quote?.isValid ? cart.quote.totalAmount : null}
                count={cart.items.reduce((sum, line) => sum + line.quantity, 0)}
                tableCode={m.table?.tableCode}
              >
                {canReviewCart(cart) && !disabled ? (
                  <Link to="/checkout" className="btn-primary w-full">
                    Review order
                    <Icon name="arrow" size={18} />
                  </Link>
                ) : (
                  <button className="btn-primary w-full" disabled>
                    Review order
                  </button>
                )}
              </CartSummary>
            </div>
          </>
        ) : (
          <div className="panel mt-8 px-6 py-12 text-center">
            <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-mint text-brand">
              <Icon name="bag" size={36} />
            </span>
            <h2 className="mt-5 text-2xl font-bold">Your cart is empty</h2>
            <p className="mt-3 text-sm text-muted">
              Find something delicious on the menu.
            </p>
            <Link to="/menu" className="btn-primary mt-6">
              Explore the menu
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        ))}
      {editing && cart && (
        <CartEditModal
          key={editing.version + ':' + editing.index}
          sessionId={cart.tableSessionId}
          editing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => toast.success('Cart updated.')}
        />
      )}
      {confirmClear && cart && (
        <Modal
          title="Clear your cart?"
          closeLabel="Cancel"
          onClose={() => {
            if (!m.pending) setConfirmClear(false)
          }}
        >
          <div className="space-y-5 p-6">
            <p className="text-sm text-muted">
              Remove all selected dishes from this cart?
            </p>
            <CartStatus management={m} />
            <div className="flex justify-end gap-3">
              <button
                disabled={m.pending}
                className="btn-secondary"
                onClick={() => setConfirmClear(false)}
              >
                Cancel
              </button>
              <button
                disabled={disabled}
                className="btn-primary"
                onClick={() => {
                  void m
                    .save({ kind: 'clear', version: cart.version })
                    .then(() => setConfirmClear(false))
                    .catch(() => {})
                }}
              >
                {m.pending ? 'Clearing...' : 'Clear cart'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
