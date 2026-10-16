import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  tableStorageKey,
  tableStateSchema,
  replaceTables,
} from '../../tables/tableSlice'
import { addSetupAudit } from '../../activity/activitySlice'
import { audit } from '../../activity/createAudit'
export function useTableQr() {
  const tables = useAppSelector((s) => s.adminTables)
  const areas = useAppSelector((s) => s.adminAreas)
  const state = { tables, areas }
  const dispatch = useAppDispatch()
  function commit(
    next: typeof state,
    action: string,
    target: string,
    reason: string,
  ) {
    const parsed = tableStateSchema.safeParse(next.tables)
    if (!parsed.success)
      return parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ.'
    try {
      localStorage.setItem(tableStorageKey, JSON.stringify(parsed.data))
    } catch {
      return 'Không thể lưu trên trình duyệt. Kiểm tra dung lượng lưu trữ.'
    }
    dispatch(replaceTables(parsed.data))
    dispatch(addSetupAudit(audit(action, target, reason)))
    return ''
  }
  function regenerateQr(id: string) {
    const t = state.tables.find((t) => t.id === id)
    if (
      !t ||
      !t.active ||
      !state.areas.some((a) => a.id === t.areaId && a.active)
    )
      return 'Bàn phải hoạt động và thuộc khu vực đang hoạt động.'
    return commit(
      {
        ...state,
        tables: state.tables.map((t) =>
          t.id === id ? { ...t, token: crypto.randomUUID() } : t,
        ),
      },
      t.token ? 'Tạo lại QR bàn' : 'Tạo QR bàn',
      t.name,
      'Đổi token truy cập; không lưu token vào nhật ký.',
    )
  }
  return { state, regenerateQr }
}
