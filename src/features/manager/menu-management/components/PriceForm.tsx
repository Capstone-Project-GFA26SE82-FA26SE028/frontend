import { useState } from 'react'
import { Field, fieldClass } from '../../../admin/components/AdminUI'
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
      <Field label="Menu item *">
        <select
          name="item"
          required
          disabled={target.mode !== 'create'}
          defaultValue={price?.itemId || defaultItemId}
          className={fieldClass}
        >
          <option value="" disabled>
            Select an item
          </option>
          {items.map((i) => (
            <option key={i.itemId} value={i.itemId}>
              {i.itemName}
            </option>
          ))}
        </select>
      </Field>
      {!replace && (
        <Field label="Sales channel *">
          <select
            name="channel"
            defaultValue={price?.channel || 'AllChannels'}
            className={fieldClass}
          >
            {Object.entries(channels).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Price (VND) *">
        <input
          name="amount"
          type="number"
          min="0"
          step="0.01"
          max="9999999999999999.99"
          required
          defaultValue={price?.amount}
          className={fieldClass}
        />
      </Field>
      {replace ? (
        <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
          The new price takes effect immediately for the same channel and time
          window. Previous prices remain in history, and existing orders keep
          their original prices.
        </p>
      ) : (
        <Field label="Effective from (UTC+7) *">
          <input
            name="start"
            type="datetime-local"
            required
            defaultValue={localInput(
              price?.effectiveFrom || new Date().toISOString(),
            )}
            className={fieldClass}
          />
        </Field>
      )}
      <Field label="Effective until (UTC+7)">
        <input
          name="end"
          type="datetime-local"
          defaultValue={price?.effectiveTo ? localInput(price.effectiveTo) : ''}
          className={fieldClass}
        />
      </Field>
      {!replace && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start time">
              <input
                name="dailyStart"
                type="time"
                defaultValue={price?.dailyStart?.slice(0, 5) || ''}
                className={fieldClass}
              />
            </Field>
            <Field label="End time">
              <input
                name="dailyEnd"
                type="time"
                defaultValue={price?.dailyEnd?.slice(0, 5) || ''}
                className={fieldClass}
              />
            </Field>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Leave both times empty for all-day pricing. Select all channels and
            all day to create a standard price.
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
