import type { Area } from './schema'
import type { RestaurantTable } from '../tables/schema'
type RuleState = { areas: Area[]; tables: RestaurantTable[] }
export function areaError(state: RuleState, area: Area) {
  if (
    state.areas.some(
      (a) =>
        a.id !== area.id && a.code.toLowerCase() === area.code.toLowerCase(),
    )
  )
    return 'Mã khu vực đã tồn tại.'
  if (
    !area.active &&
    state.tables.some((t) => t.areaId === area.id && t.active)
  )
    return 'Chuyển hoặc ngừng sử dụng các bàn trước khi tắt khu vực.'
  return ''
}
