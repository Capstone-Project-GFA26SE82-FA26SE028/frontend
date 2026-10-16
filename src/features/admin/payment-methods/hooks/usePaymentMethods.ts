import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  paymentMethodStorageKey,
  paymentMethodStateSchema,
  replacePaymentMethods,
} from '../../payment-methods/paymentMethodSlice'
import { addSetupAudit } from '../../activity/activitySlice'
import { audit } from '../../activity/createAudit'
import type { PaymentMethods } from '../schema'
export function usePaymentMethods() {
  const methods = useAppSelector((s) => s.adminPaymentMethods)
  const state = { methods }
  const dispatch = useAppDispatch()
  function commit(
    next: typeof state,
    action: string,
    target: string,
    reason: string,
  ) {
    const parsed = paymentMethodStateSchema.safeParse(next.methods)
    if (!parsed.success)
      return parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ.'
    try {
      localStorage.setItem(paymentMethodStorageKey, JSON.stringify(parsed.data))
    } catch {
      return 'Không thể lưu trên trình duyệt. Kiểm tra dung lượng lưu trữ.'
    }
    dispatch(replacePaymentMethods(parsed.data))
    dispatch(addSetupAudit(audit(action, target, reason)))
    return ''
  }
  function saveMethods(methods: PaymentMethods) {
    if (!methods.cash && !methods.payos)
      return 'Phải giữ ít nhất một phương thức thanh toán.'
    if (methods.payos && !methods.demoConnected)
      return 'Thiết lập kết nối PayOS mẫu trước khi bật.'
    return commit(
      { ...state, methods },
      'Cấu hình phương thức thanh toán',
      'Thanh toán nhà hàng',
      JSON.stringify({ before: state.methods, after: methods }),
    )
  }
  return { state, saveMethods }
}
