import { Icon } from '../../../../components/Icon/Icon'

export function PaymentPendingStatus() {
  return (
    <div role="status" className="mt-6 rounded-2xl bg-mint p-5 text-brand">
      <div className="flex items-center gap-2 font-bold">
        <Icon name="clock" />
        Chờ xác nhận thanh toán
      </div>
      <p className="mt-2 text-sm leading-6">
        Thanh toán chưa hoàn tất. Vui lòng liên hệ nhân viên để kiểm tra hóa đơn và xác nhận thanh toán.
      </p>
    </div>
  )
}
