import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'

export function OrderTrackingActions() {
  return (
    <aside className="panel h-fit p-6">
      <Icon name="utensils" size={32} className="text-brand" />
      <h2 className="mt-4 text-xl font-bold">Cứ thong thả, bạn nhé</h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        Bạn có thể gọi thêm món hoặc xem tổng tiền của bữa ăn tại đây.
      </p>
      <Link to="/menu" className="btn-secondary mt-5 w-full">
        Gọi thêm món
      </Link>
      <Link to="/payment" className="btn-primary mt-3 w-full">
        Xem thanh toán <Icon name="arrow" size={18} />
      </Link>
    </aside>
  )
}
