import type { RestaurantTable } from './schema'
import type { Area } from '../areas/schema'
type RuleState = { areas: Area[]; tables: RestaurantTable[] }
export function tableError(state: RuleState, table: RestaurantTable) {
  if (
    state.tables.some(
      (t) =>
        t.id !== table.id && t.code.toLowerCase() === table.code.toLowerCase(),
    )
  )
    return 'Mã bàn đã tồn tại.'
  const previous = state.tables.find((t) => t.id === table.id)
  if (previous?.busy && (previous.areaId !== table.areaId || !table.active))
    return 'Bàn đang có phiên phục vụ, không thể chuyển khu vực hoặc ngừng sử dụng.'
  if (
    table.areaId &&
    !state.areas.some((a) => a.id === table.areaId && a.active)
  )
    return 'Chọn khu vực đang hoạt động.'
  return ''
}
