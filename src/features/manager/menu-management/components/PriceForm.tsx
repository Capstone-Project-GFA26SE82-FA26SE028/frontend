import { useState } from 'react'

import { Field } from '../../../../components/Field/Field'
import { channels } from '../constants/catalog'
import type { Item, PriceFormTarget, PriceInput } from '../types/catalog'
import { localInput, toUtc } from '../utils/price'
import { FormActions } from './FormActions'

export function PriceForm({
  target,
  items,
  defaultItemId,
  pending,
  close,
  save,
}: {
  target: PriceFormTarget
  items: Item[]
  defaultItemId: string
  pending: boolean
  close: () => void
  save: (input: PriceInput) => void
}) {
  const price = target.price
  const replace = target.mode === 'replace'
  const [error, setError] = useState('')
  return (
    <form
      className="space-y-4 p-6"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const start = String(data.get('start') || '')
        const end = String(data.get('end') || '')
        const dailyStart = String(data.get('dailyStart') || '')
        const dailyEnd = String(data.get('dailyEnd') || '')
        if (
          (dailyStart && !dailyEnd) ||
          (!dailyStart && dailyEnd) ||
          (dailyStart && dailyEnd <= dailyStart)
        ) {
          setError(
            'Enter both times. The end time must be after the start time.',
          )
          return
        }
        if (
          end &&
          new Date(toUtc(end)).getTime() <=
            (replace ? Date.now() : new Date(toUtc(start)).getTime())
        ) {
          setError('The end date must be after the effective start date.')
          return
        }
        setError('')
        save({
          itemId: price?.itemId || String(data.get('item')),
          channel:
            price?.channel && replace
              ? price.channel
              : String(data.get('channel')),
          amount: Number(data.get('amount')),
          effectiveFrom: replace ? price!.effectiveFrom : toUtc(start),
          effectiveTo: end ? toUtc(end) : null,
          dailyStart: dailyStart ? `${dailyStart}:00` : null,
          dailyEnd: dailyEnd ? `${dailyEnd}:00` : null,
        })
      }}
    >
      <Field label="Món ăn *">
        <select
          name="item"
          required
          disabled={target.mode !== 'create'}
          defaultValue={price?.itemId || defaultItemId}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="" disabled>
            Chọn món
          </option>
          {items.map((i) => (
            <option key={i.itemId} value={i.itemId}>
              {i.itemName}
            </option>
          ))}
        </select>
      </Field>
      {!replace && (
        <Field label="Kênh bán *">
          <select
            name="channel"
            defaultValue={price?.channel || 'AllChannels'}
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {Object.entries(channels).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Giá (VNĐ) *">
        <input
          name="amount"
          type="number"
          min="0"
          step="0.01"
          max="9999999999999999.99"
          required
          defaultValue={price?.amount}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </Field>
      {replace ? (
        <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
          Giá mới có hiệu lực ngay với cùng kênh bán và khung giờ. Giá cũ được
          lưu trong lịch sử, các đơn đã tạo giữ nguyên giá ban đầu.
        </p>
      ) : (
        <Field label="Có hiệu lực từ (UTC+7) *">
          <input
            name="start"
            type="datetime-local"
            required
            defaultValue={localInput(
              price?.effectiveFrom || new Date().toISOString(),
            )}
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </Field>
      )}
      <Field label="Có hiệu lực đến (UTC+7)">
        <input
          name="end"
          type="datetime-local"
          defaultValue={price?.effectiveTo ? localInput(price.effectiveTo) : ''}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </Field>
      {!replace && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Giờ bắt đầu">
              <input
                name="dailyStart"
                type="time"
                defaultValue={price?.dailyStart?.slice(0, 5) || ''}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </Field>
            <Field label="Giờ kết thúc">
              <input
                name="dailyEnd"
                type="time"
                defaultValue={price?.dailyEnd?.slice(0, 5) || ''}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </Field>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Để trống cả hai giờ để áp dụng cả ngày. Chọn tất cả kênh và cả ngày
            để tạo giá tiêu chuẩn.
          </p>
        </>
      )}
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
      <FormActions pending={pending || !items.length} close={close} />
    </form>
  )
}
