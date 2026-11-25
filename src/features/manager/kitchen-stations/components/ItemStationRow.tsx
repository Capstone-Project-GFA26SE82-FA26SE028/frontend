import { useState } from 'react'
import { buttonClass, inputClass } from '../constants/kitchenStation'
import { stationLabel } from '../utils/kitchenStation'
import type { KitchenStation, StationItem } from '../types/kitchenStation'
export function ItemStationRow({
  item,
  stations,
  pending,
  onSave,
}: {
  item: StationItem
  stations: KitchenStation[]
  pending: boolean
  onSave: (stationId: string | null) => void
}) {
  const [selected, setSelected] = useState(item.kitchenStationId || '')
  return (
    <tr className="border-t border-slate-100">
      <td>{item.itemCode}</td>
      <td className="font-medium">{item.itemName}</td>
      <td>
        <select
          aria-label={`Trạm bếp cho ${item.itemName}`}
          value={selected}
          disabled={pending}
          onChange={(event) => setSelected(event.target.value)}
          className={inputClass}
        >
          <option value="">Chưa gán riêng</option>
          {item.kitchenStationId &&
            !stations.some(
              (station) => station.kitchenStationId === item.kitchenStationId,
            ) && (
              <option disabled value={item.kitchenStationId}>
                Trạm không còn khả dụng
              </option>
            )}
          {stations
            .filter(
              (station) =>
                station.isActive ||
                station.kitchenStationId === item.kitchenStationId,
            )
            .map((station) => (
              <option
                key={station.kitchenStationId}
                value={station.kitchenStationId}
                disabled={!station.isActive}
              >
                {stationLabel(station)}
              </option>
            ))}
        </select>
      </td>
      <td>
        <button
          className={buttonClass}
          disabled={pending || selected === (item.kitchenStationId || '')}
          onClick={() => onSave(selected || null)}
        >
          Lưu
        </button>
      </td>
    </tr>
  )
}
