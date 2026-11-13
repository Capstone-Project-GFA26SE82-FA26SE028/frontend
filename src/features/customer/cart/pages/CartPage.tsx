import { CartEditModal } from '../components/CartEditModal'
import type { CartEditTarget } from '../types/types'
import { toast } from 'react-toastify'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { CartStatus } from '../components/CartStatus'
import { useCustomerCart } from '../hooks/useCustomerCart'
import { quotedItem, canReviewCart } from '../cartHelpers'
import { CartRecommendations } from '../../recommendations/components/CartRecommendations'
export function CartPage() {
  const m = useCustomerCart()
  // Keep the automatic request limited to once per visit, even as cart versions change.
  const autoRequested = useRef(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [editing, setEditing] = useState<CartEditTarget | null>(null)
  const cart = m.cart.data
  const disabled =
    m.pending || m.cart.isFetching || m.cart.isError || m.mutation.isError
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
        <h1 className="text-center text-base font-medium">Các món đang chọn</h1>
        {cart?.items.length ? (
          <button
            className="min-h-9 rounded-lg bg-red-50 px-2 text-xs text-red-500 transition-colors hover:bg-red-100 disabled:opacity-45"
            aria-label="Xóa giỏ"
            disabled={disabled}
            onClick={() => setConfirmClear(true)}
          >
            Xóa
          </button>
        ) : (
          <span aria-hidden="true" />
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
                  'Một số món hoặc tùy chọn không còn phục vụ. Vui lòng kiểm tra giỏ hàng trước khi tiếp tục.'}
              </p>
            )}
            <div className="mt-4 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="min-w-0 space-y-4">
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
                          .save({
                            kind: 'remove',
                            index,
                            version: cart.version,
                          })
                          .catch(() => {})
                      }}
                    />
                  ))}
                  <Link
                    to="/menu"
                    className="my-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand"
                  >
                    <Icon name="plus" size={18} />
                    Chọn thêm món
                  </Link>
                </div>
                <CartRecommendations
                  autoRequested={autoRequested}
                  key={`${cart.tableSessionId}:${cart.cartId}:${cart.version}`}
                  sessionId={cart.tableSessionId}
                  cartId={cart.cartId}
                  version={cart.version}
                  disabled={disabled || !cart.quote?.isValid}
                  onReload={m.reload}
                />
              </div>
              <CartSummary
                total={cart.quote?.isValid ? cart.quote.totalAmount : null}
                count={cart.items.reduce((sum, line) => sum + line.quantity, 0)}
                tableCode={m.table?.tableCode}
              >
                {canReviewCart(cart) && !disabled ? (
                  <Link to="/checkout" className="btn-primary w-full">
                    Kiểm tra đơn
                    <Icon name="arrow" size={18} />
                  </Link>
                ) : (
                  <button className="btn-primary w-full" disabled>
                    Kiểm tra đơn
                  </button>
                )}
              </CartSummary>
            </div>
          </>
        ) : (
          <div className="panel mt-4 px-6 py-12 text-center">
            <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-mint text-brand">
              <Icon name="bag" size={36} />
            </span>
            <h2 className="mt-5 text-2xl font-bold">Giỏ hàng đang trống</h2>
            <p className="mt-3 text-sm text-muted">
              Khám phá thực đơn và chọn món bạn yêu thích.
            </p>
            <Link to="/menu" className="btn-primary mt-6">
              Xem thực đơn
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
          onSaved={() => toast.success('Đã cập nhật giỏ hàng.')}
        />
      )}
      {confirmClear && cart && (
        <Modal
          title="Xóa giỏ hàng?"
          closeLabel="Hủy"
          onClose={() => {
            if (!m.pending) setConfirmClear(false)
          }}
        >
          <div className="space-y-5 p-6">
            <p className="text-sm text-muted">
              Bạn muốn xóa tất cả món đang chọn trong giỏ hàng?
            </p>
            <CartStatus management={m} />
            <div className="flex justify-end gap-3">
              <button
                disabled={m.pending}
                className="btn-secondary"
                onClick={() => setConfirmClear(false)}
              >
                Hủy
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
                {m.pending ? 'Đang xóa…' : 'Xóa giỏ'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
