import { useState } from 'react'
import type { Area } from '../../areas/types/types'
import type { Table } from '../types/types'

import { Field } from '../../../../components/Field/Field'
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
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          onClick={onClose}
        >
          Hủy
        </button>
        <button
          disabled={pending || !selected}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
        >
          {pending ? 'Đang chuyển…' : 'Chuyển bàn'}
        </button>
      </div>
    </form>
  )
}
