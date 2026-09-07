import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'

export function CartPage() {
  const items = useAppSelector((state) => state.cart.items)
  return (
    <>
      <h1>Giỏ hàng</h1>
      {items.length === 0 ? (
        <EmptyState
          title="Giỏ hàng chưa có món"
          description="Khám phá thực đơn để chọn món cho bữa ăn của bạn."
          action={<Link to="/menu">Xem thực đơn</Link>}
        />
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} × {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
