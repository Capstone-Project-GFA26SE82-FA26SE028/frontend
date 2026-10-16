import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
export function CartPage() {
  const items = useAppSelector((s) => s.cart.items)
  return (
    <section className="py-6 pb-12">
      <p className="eyebrow">Những món ngon đã chọn</p>
      <h1 className="mt-2 text-4xl font-bold">Giỏ hàng của bạn</h1>
      <p className="mt-3 text-muted">
        Xem lại một chút, rồi để Mộc chăm lo bữa ăn.
      </p>
      {items.length ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="panel px-5 sm:px-7">
            {items.map((i) => (
              <CartItem key={i.id} item={i} />
            ))}
            <Link
              to="/menu"
              className="my-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand"
            >
              <Icon name="plus" size={18} />
              Chọn thêm món ngon
            </Link>
          </div>
          <CartSummary
            total={items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)}
            count={items.reduce((s, i) => s + i.quantity, 0)}
          >
            <Link to="/checkout" className="btn-primary w-full">
              Tiếp tục gọi món <Icon name="arrow" size={18} />
            </Link>
          </CartSummary>
        </div>
      ) : (
        <div className="panel mt-8 p-10 text-center sm:p-16">
          <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-mint text-brand">
            <Icon name="bag" size={36} />
          </span>
          <h2 className="mt-5 text-2xl font-bold">Bữa ngon đang đợi bạn</h2>
          <p className="mt-3 text-sm text-muted">
            Giỏ hàng còn trống. Ghé thực đơn để chọn món yêu thích nhé.
          </p>
          <Link to="/menu" className="btn-primary mt-6">
            Khám phá thực đơn <Icon name="arrow" size={18} />
          </Link>
        </div>
      )}
    </section>
  )
}
