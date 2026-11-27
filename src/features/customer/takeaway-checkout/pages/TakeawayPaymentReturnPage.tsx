import { Link, Navigate } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'

import { getTakeawayPaymentReturn } from '../utils/takeawayPaymentReturn'

export function TakeawayPaymentReturnPage() {
  const userId = useAppSelector((state) => state.auth.session?.user.userId)
  const destination = getTakeawayPaymentReturn(userId)

  if (destination) return <Navigate to={destination} replace />

  return (
    <main className="grid min-h-dvh place-items-center bg-[#faf9f6] px-4 text-[#173e32]">
      <section className="panel w-full max-w-md space-y-4 p-6 text-center">
        <h1 className="text-xl font-bold">Quay lại DineLink</h1>
        <p className="text-sm text-muted">Mở lại trang đơn hàng để xem trạng thái thanh toán.</p>
        <Link className="btn-secondary" to="/restaurants">Xem nhà hàng</Link>
      </section>
    </main>
  )
}