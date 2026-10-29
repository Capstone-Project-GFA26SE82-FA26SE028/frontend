import { useState } from 'react'
import type { Area } from '../../areas/types/types'
import type { Table } from '../types/types'
import {
  Field,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
import { tableError } from '../api/tableApi'
export function TableMoveForm({
  table,
  areas,
  pending,
  onMove,
  onClose,
}: {
  table: Table
  areas: Area[]
  pending: boolean
  onMove: (id: string) => Promise<unknown>
  onClose: () => void
}) {
  const [selected, setSelected] = useState(''),
    [error, setError] = useState('')
  const current = areas.find((a) => a.areaId === table.areaId)
  const choices = areas.filter(
    (a) =>
      a.restaurantId === current?.restaurantId &&
      a.isActive &&
      a.areaId !== table.areaId,
  )
  return (
    <form
      className="space-y-5 p-6"
      onSubmit={async (e) => {
        e.preventDefault()
        setError('')
        try {
          await onMove(selected)
        } catch (err) {
          setError(tableError(err))
        }
      }}
    >
      <p className="text-sm text-slate-500">
        Chuyển {table.tableCode} từ{' '}
        {current?.areaName || 'Khu vực chưa xác định'} sang một khu vực đang
        hoạt động trong cùng nhà hàng.
      </p>
      <Field label="Khu vực đích">
        <select
          required
          disabled={pending}
          className={fieldClass}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Chọn khu vực đích</option>
          {choices.map((a) => (
            <option key={a.areaId} value={a.areaId}>
              {a.areaName}
            </option>
          ))}
        </select>
      </Field>
      {!choices.length && (
        <p className="text-sm text-slate-500">
          Không có khu vực đang hoạt động khác.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={pending}
          className={secondaryButton}
          onClick={onClose}
        >
          Hủy
        </button>
        <button disabled={pending || !selected} className={primaryButton}>
          {pending ? 'Đang chuyển…' : 'Chuyển bàn'}
        </button>
      </div>
    </form>
  )
}
