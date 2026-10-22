import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
  areaStorageKey,
  areaStateSchema,
  replaceAreas,
} from '../../areas/areaSlice'
import type { Area } from '../schema'
import { areaError } from '../rules'
export function useAreas() {
  const areas = useAppSelector((s) => s.adminAreas)
  const tables = useAppSelector((s) => s.adminTables)
  const state = { areas, tables }
  const dispatch = useAppDispatch()
  function commit(next: typeof state) {
    const parsed = areaStateSchema.safeParse(next.areas)
    if (!parsed.success)
      return parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ.'
    try {
      localStorage.setItem(areaStorageKey, JSON.stringify(parsed.data))
    } catch {
      return 'Không thể lưu trên trình duyệt. Kiểm tra dung lượng lưu trữ.'
    }
    dispatch(replaceAreas(parsed.data))
    return ''
  }
  function saveArea(area: Area) {
    const error = areaError(state, area)
    if (error) return error
    const old = state.areas.find((a) => a.id === area.id)
    return commit({
      ...state,
      areas: old
        ? state.areas.map((a) => (a.id === area.id ? area : a))
        : [...state.areas, area],
    })
  }
  function deleteArea(id: string) {
    const a = state.areas.find((a) => a.id === id)
    if (!a) return 'Không tìm thấy khu vực.'
    if (state.tables.some((t) => t.areaId === id))
      return 'Khu vực còn bàn, không được xóa.'
    return commit({ ...state, areas: state.areas.filter((a) => a.id !== id) })
  }
  return { state, saveArea, deleteArea }
}
