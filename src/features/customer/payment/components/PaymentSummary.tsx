import { formatCurrency } from '../../../../utils/currency'

type PaymentSummaryProps = { total: number; orderCount: number }

export function PaymentSummary({ total, orderCount }: PaymentSummaryProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-6">
        <span>Bàn 08 · {orderCount} lượt gọi</span>
        <span className="text-2xl font-bold text-brand">
          {formatCurrency(total)}
        </span>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted">
        Tổng tạm tính chưa bao gồm thuế, phí và ưu đãi. Vui lòng kiểm tra hóa đơn trước khi thanh toán.
      </p>
    </>
  )
}
