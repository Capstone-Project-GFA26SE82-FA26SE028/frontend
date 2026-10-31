import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tableSchema, type TableValues } from '../schemas/tableSchema'
import type { Table } from '../types/types'
import type { Area } from '../../areas/types/types'
import type { Restaurant } from '../../restaurants/types/types'

import { Field } from '../../../../components/Field/Field'
import { tableError } from '../api/tableApi'
export function TableForm({
  table,
  areas,
  restaurants,
  initialRestaurantId,
  initialAreaId,
  pending,
  onSave,
  onClose,
}: {
  table?: Table
  areas: Area[]
  restaurants: Restaurant[]
  initialRestaurantId: string
  initialAreaId: string
  pending: boolean
  onSave: (v: TableValues) => Promise<unknown>
  onClose: () => void
}) {
  const [restaurantId, setRestaurantId] = useState(
    table
      ? areas.find((a) => a.areaId === table.areaId)?.restaurantId || ''
      : initialRestaurantId,
  )
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<TableValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: table
      ? {
          areaId: table.areaId,
          tableCode: table.tableCode,
          capacity: table.capacity,
          positionX: table.positionX,
          positionY: table.positionY,
          version: table.version,
        }
      : {
          areaId: areas.some((a) => a.areaId === initialAreaId && a.isActive)
            ? initialAreaId
            : '',
          tableCode: '',
          capacity: 4,
          positionX: null,
          positionY: null,
          version: '',
        },
  })
  return (
    <form
      className="space-y-5 p-6"
      onSubmit={handleSubmit(async (values) => {
        clearErrors('root')
        try {
          await onSave(values)
        } catch (e) {
          setError('root', { message: tableError(e) })
        }
      })}
    >
      <fieldset
        disabled={pending || isSubmitting}
        className="min-w-0 space-y-5"
      >
        <div className="grid gap-4 rounded-2xl bg-emerald-50 p-4 sm:grid-cols-2">
          <Field label="Nhà hàng *">
            <select
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
              disabled={!!table}
              value={restaurantId}
              onChange={(e) => {
                setRestaurantId(e.target.value)
                setValue('areaId', '', { shouldDirty: true })
              }}
            >
              <option value="">Chọn nhà hàng</option>
              {restaurants.map((r) => (
                <option key={r.restaurantId} value={r.restaurantId}>
                  {r.restaurantName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Khu vực *" error={errors.areaId?.message}>
            <select
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              {...register('areaId')}
            >
              <option value="">Chọn khu vực đang hoạt động</option>
              {areas
                .filter(
                  (a) =>
                    a.restaurantId === restaurantId &&
                    (a.isActive || a.areaId === table?.areaId),
                )
                .map((a) => (
                  <option
                    key={a.areaId}
                    value={a.areaId}
                    disabled={!a.isActive}
                  >
                    {a.areaName}
                    {!a.isActive ? ' (Inactive)' : ''}
                  </option>
                ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mã bàn *" error={errors.tableCode?.message}>
            <input
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              maxLength={50}
              placeholder="Ví dụ: B01"
              {...register('tableCode')}
            />
          </Field>
          <Field label="Sức chứa *" error={errors.capacity?.message}>
            <input
              type="number"
              min={1}
              max={2147483647}
              step={1}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              {...register('capacity', { valueAsNumber: true })}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(['positionX', 'positionY'] as const).map((key) => (
            <Field
              key={key}
              label={
                key === 'positionX'
                  ? 'Tọa độ X (không bắt buộc)'
                  : 'Tọa độ Y (không bắt buộc)'
              }
              error={errors[key]?.message}
            >
              <input
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                type="number"
                step="0.01"
                min={-99999999.99}
                max={99999999.99}
                {...register(key, {
                  setValueAs: (v) => (v == null || v === '' ? null : Number(v)),
                })}
              />
            </Field>
          ))}
        </div>
        <input type="hidden" {...register('version')} />
        {errors.root && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
          >
            {errors.root.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 justify-center"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40 justify-center"
            disabled={!!table && !isDirty}
          >
            {pending ? 'Đang lưu…' : table ? 'Lưu thay đổi' : 'Tạo bàn'}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
