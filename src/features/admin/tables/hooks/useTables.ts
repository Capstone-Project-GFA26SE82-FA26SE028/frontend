import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  tableStorageKey,
  tableStateSchema,
  replaceTables,
} from '../../tables/tableSlice'
import { addSetupAudit } from '../../activity/activitySlice'
import { audit } from '../../activity/createAudit'
import type { RestaurantTable } from '../schema'
import { tableError } from '../rules'
export function useTables() {
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
  function saveTable(table: RestaurantTable) {
    const error = tableError(state, table)
    if (error) return error
    const old = state.tables.find((t) => t.id === table.id)
    const next = {
      ...table,
      token: !table.active || !table.areaId ? undefined : table.token,
    }
    return commit(
      {
        ...state,
        tables: old
          ? state.tables.map((t) => (t.id === table.id ? next : t))
          : [...state.tables, next],
      },
      old ? 'Cập nhật bàn' : 'Thêm bàn',
      table.name,
      JSON.stringify({
        before: old ? { ...old, token: undefined } : undefined,
        after: { ...next, token: undefined },
      }),
    )
  }
  function deleteTable(id: string) {
    const t = state.tables.find((t) => t.id === id)
    if (!t) return 'Không tìm thấy bàn.'
    if (t.busy || t.history)
      return 'Bàn có phiên hoặc lịch sử đơn. Hãy ngừng sử dụng để giữ dữ liệu.'
    return commit(
      { ...state, tables: state.tables.filter((t) => t.id !== id) },
      'Xóa bàn',
      t.name,
      'Xóa bàn chưa có lịch sử.',
    )
  }
  return { state, saveTable, deleteTable }
}
