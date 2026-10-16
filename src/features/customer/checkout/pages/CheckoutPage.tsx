import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { clearCart } from '../../cart/cartSlice'
import { placeOrder } from '../../order-tracking/orderSlice'
import { CartSummary } from '../../cart/components/CartSummary'
import { CheckoutOrderReview } from '../components/CheckoutOrderReview'
import { Icon } from '../../../../components/Icon/Icon'
export function CheckoutPage() {
  const items = useAppSelector((s) => s.cart.items)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const submitted = useRef(false)
  return (
    <section className="py-6 pb-12">
      <p className="eyebrow">Sắp đến một bữa ngon</p>
      <h1 className="mt-2 text-4xl font-bold">Xác nhận gọi món</h1>
      {items.length ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <CheckoutOrderReview items={items} />
          <CartSummary
            total={items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)}
            count={items.reduce((s, i) => s + i.quantity, 0)}
          >
            <button
              className="btn-primary w-full"
              onClick={() => {
                if (submitted.current) return
                submitted.current = true
                dispatch(
                  placeOrder({
                    id: crypto.randomUUID(),
                    items: items.map((i) => ({ ...i })),
                    createdAt: new Date().toISOString(),
                    paymentRequested: false,
                    method: null,
                  }),
                )
                dispatch(clearCart())
                navigate('/orders')
              }}
            >
              Xác nhận gọi món <Icon name="check" size={18} />
            </button>
            <p className="mt-3 text-xs leading-5 text-muted">
              Sau khi chọn món, vui lòng xác nhận với nhân viên để bếp chuẩn bị.
            </p>
          </CartSummary>
        </div>
      ) : (
        <div className="panel mt-8 p-8">
          <p>Chưa có món để xác nhận.</p>
          <Link to="/menu" className="btn-primary mt-5">
            Chọn món ngay
          </Link>
        </div>
      )}
    </section>
  )
}
