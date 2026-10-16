import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useTableQr } from '../hooks/useTableQr'
import { RestaurantHeading } from '../../components/RestaurantHeading'
import { TableQrCard } from '../components/TableQrCard'
import {
  ConfirmAction,
  EmptyState,
  SearchField,
  fieldClass,
} from '../../components/AdminUI'
import { matches } from '../../utils'
export function TableQrPage() {
  const { state, regenerateQr } = useTableQr()
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('')
  const [selected, setSelected] = useState('')
  const [error, setError] = useState('')
  const { query } = useOutletContext<{ query: string }>()
  const rows = state.tables.filter(
    (t) =>
      matches(search, t.name, t.code) &&
      matches(query, t.name, t.code) &&
      (!area || t.areaId === area),
  )
  return (
    <>
      <RestaurantHeading
        title="Mã QR bàn"
        description="Tạo, tải và quản lý mã truy cập theo từng bàn"
      />
      <p className="mb-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
        QR hiện chỉ xác thực trong trình duyệt lưu dữ liệu mẫu. Thiết bị khác
        chưa truy cập được dữ liệu bàn. Khi có BE, liên kết và hiệu lực mã sẽ
        được kiểm tra trên máy chủ.
      </p>
      <div className="mb-5 flex flex-wrap gap-3">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Tìm bàn…"
        />
        <select
          aria-label="Khu vực"
          className={fieldClass + ' sm:max-w-60'}
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          <option value="">Mọi khu vực</option>
          {state.areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {rows.map((t) => (
          <TableQrCard
            key={t.id + ':' + (t.token || '')}
            table={t}
            area={
              state.areas.find((a) => a.id === t.areaId)?.name ||
              'Chưa phân khu vực'
            }
            eligible={
              t.active && state.areas.some((a) => a.id === t.areaId && a.active)
            }
            onGenerate={() => {
              setError('')
              setSelected(t.id)
            }}
          />
        ))}
      </div>
      {!rows.length && <EmptyState />}
      {selected && (
        <ConfirmAction
          title="Tạo mã QR bàn"
          description="Mã cũ (nếu có) sẽ mất hiệu lực trong bản mẫu này. Sau khi tạo lại, hãy thay ảnh QR đã đặt tại bàn."
          onClose={() => setSelected('')}
          onConfirm={() => {
            const e = regenerateQr(selected)
            if (e) setError(e)
            else setSelected('')
          }}
        >
          {error && (
            <p role="alert" className="text-rose-600">
              {error}
            </p>
          )}
        </ConfirmAction>
      )}
    </>
  )
}
