import { Icon } from '../../../../components/Icon/Icon'

type ReservationSuccessProps = {
  onReset: () => void
}

export function ReservationSuccess({ onReset }: ReservationSuccessProps) {
  return (
    <div className="py-12 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-mint text-brand">
        <Icon name="check" size={30} />
      </span>
      <h2 className="mt-5 text-2xl font-bold">Đã hoàn tất bản xem trước</h2>
      <p role="status" className="mt-3 text-sm leading-7 text-muted">
        Yêu cầu chưa được gửi đến nhà hàng.
      </p>
      <button onClick={onReset} className="btn-secondary mt-6">
        Tạo yêu cầu khác
      </button>
    </div>
  )
}
