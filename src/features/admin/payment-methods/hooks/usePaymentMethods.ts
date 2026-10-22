import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  paymentMethodStorageKey,
  paymentMethodStateSchema,
  replacePaymentMethods,
} from '../../payment-methods/paymentMethodSlice'
import type { PaymentMethods } from '../schema'
export function usePaymentMethods() {
  const methods = useAppSelector((s) => s.adminPaymentMethods)
  const state = { methods }
  const dispatch = useAppDispatch()
  function commit(next: typeof state) {
    const parsed = paymentMethodStateSchema.safeParse(next.methods)
    if (!parsed.success)
      return parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ.'
    try {
      localStorage.setItem(paymentMethodStorageKey, JSON.stringify(parsed.data))
    } catch {
      return 'Không thể lưu trên trình duyệt. Kiểm tra dung lượng lưu trữ.'
    }
    dispatch(replacePaymentMethods(parsed.data))
    return ''
  }
  function saveMethods(methods: PaymentMethods) {
    if (!methods.cash && !methods.payos)
      return 'Phải giữ ít nhất một phương thức thanh toán.'
    if (methods.payos && !methods.demoConnected)
      return 'Thiết lập kết nối PayOS mẫu trước khi bật.'
    return commit({ ...state, methods })
  }
  return { state, saveMethods }
}
