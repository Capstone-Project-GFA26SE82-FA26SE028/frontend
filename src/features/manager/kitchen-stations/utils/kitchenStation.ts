import type { KitchenStation } from '../types/kitchenStation'
export function stationLabel(station: KitchenStation) {
  return `${station.kitchenStationCode} · ${station.kitchenStationName}${station.isActive ? '' : ' (ngừng hoạt động)'}`
}
