import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  taxFeeStorageKey,
  taxFeeStateSchema,
  replaceTaxFees,
} from '../../tax-fees/taxFeeSlice'
import { addSetupAudit } from '../../activity/activitySlice'
import { audit } from '../../activity/createAudit'
import type { Fees } from '../schema'
export function useTaxFees() {
  const fees = useAppSelector((s) => s.adminTaxFees)
  const state = { fees }
  const dispatch = useAppDispatch()
  function commit(
    next: typeof state,
    action: string,
    target: string,
    reason: string,
  ) {
    const parsed = taxFeeStateSchema.safeParse(next.fees)
    if (!parsed.success)
      return parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ.'
    try {
      localStorage.setItem(taxFeeStorageKey, JSON.stringify(parsed.data))
    } catch {
      return 'Không thể lưu trên trình duyệt. Kiểm tra dung lượng lưu trữ.'
    }
    dispatch(replaceTaxFees(parsed.data))
    dispatch(addSetupAudit(audit(action, target, reason)))
    return ''
  }
  function saveFees(fees: Fees) {
    if (new Date(fees.effectiveAt).getTime() < Date.now() - 60000)
      return 'Thời điểm hiệu lực không được ở quá khứ.'
    if (
      state.fees.some(
        (f) =>
          new Date(f.effectiveAt).getTime() ===
          new Date(fees.effectiveAt).getTime(),
      )
    )
      return 'Đã có cấu hình tại thời điểm này.'
    return commit(
      { ...state, fees: [{ ...fees, id: crypto.randomUUID() }, ...state.fees] },
      'Cấu hình VAT và phí dịch vụ',
      'Cấu hình tính tiền',
      JSON.stringify(fees),
    )
  }
  return { state, saveFees }
}
