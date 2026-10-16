import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { OrderTrackingCard } from '../components/OrderTrackingCard'
import { OrderTrackingActions } from '../components/OrderTrackingActions'
export function OrderTrackingPage() {
  const orders = useAppSelector((s) => s.orders.orders)
  return (
    <section className="py-6 pb-12">
      <p className="eyebrow">Từ căn bếp đến bàn ăn</p>
      <h1 className="mt-2 text-4xl font-bold">Đơn của bạn</h1>
      <p className="mt-3 text-muted">Từng món ngon đều được chăm chút.</p>
      {orders.length ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            {orders.map((order, index) => (
              <OrderTrackingCard
                key={order.id}
                order={order}
                orderNumber={orders.length - index}
              />
            ))}
          </div>
          <OrderTrackingActions />
        </div>
      ) : (
        <div className="panel mt-8 py-16 text-center">
          <Icon name="receipt" size={40} className="mx-auto text-brand" />
          <h2 className="mt-5 text-xl font-bold">Chưa có đơn nào tại bàn</h2>
          <p className="mt-2 text-sm text-muted">
            Những món bạn gọi sẽ được hiển thị ở đây.
          </p>
          <Link to="/menu" className="btn-primary mt-6">
            Khám phá thực đơn
          </Link>
        </div>
      )}
    </section>
  )
}
