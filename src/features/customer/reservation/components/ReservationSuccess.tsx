import { Icon } from '../../../../components/Icon/Icon'
import type { CreatedReservation } from '../api/reservationApi'

type ReservationSuccessProps = {
  onReset: () => void
  reservation: CreatedReservation
}

export function ReservationSuccess({ onReset, reservation }: ReservationSuccessProps) {
  return (
    <div className="py-12 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-mint text-brand">
        <Icon name="check" size={30} />
      </span>
      <h2 className="mt-5 text-2xl font-bold">Đã gửi yêu cầu đặt bàn</h2>
      <p role="status" className="mt-3 text-sm leading-7 text-muted">
        Nhà hàng đã tiếp nhận yêu cầu và sẽ liên hệ xác nhận. Bàn chỉ được giữ sau khi nhà hàng duyệt yêu cầu.
      </p>
      <p className="mt-3 break-all text-xs text-muted">Mã yêu cầu: {reservation.reservationId}</p>
      <button onClick={onReset} className="btn-secondary mt-6">
        Tạo yêu cầu khác
      </button>
    </div>
  )
}
