import { formatCurrency } from '../../../../utils/currency'

import { Field } from '../../../../components/Field/Field'
import { catalogError } from '../api/catalogApi'
import { channels } from '../constants/catalog'
import { usePricePreview } from '../hooks/usePricePreview'
import { type Item } from '../types/catalog'
import { localInput, toUtc } from '../utils/price'

export function PricePreview({
  items,
  defaultItemId,
}: {
  items: Item[]
  defaultItemId: string
}) {
  const lookup = usePricePreview()
  return (
    <form
      className="space-y-4 p-6"
      onChange={() => lookup.reset()}
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        lookup.mutate({
          itemId: String(data.get('item')),
          channel: String(data.get('channel')),
          at: toUtc(String(data.get('at'))),
        })
      }}
    >
      <Field label="Món ăn *">
        <select
          name="item"
          defaultValue={defaultItemId}
          required
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
      <Field label="Kênh bán">
        <select
          name="channel"
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {Object.entries(channels)
            .filter(([v]) => v !== 'AllChannels')
            .map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
        </select>
      </Field>
      <Field label="Ngày giờ (UTC+7) *">
        <input
          name="at"
          type="datetime-local"
          required
          defaultValue={localInput(new Date().toISOString())}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </Field>
      {lookup.isError && (
        <p role="alert" className="text-sm text-rose-700">
          {catalogError(lookup.error)}
        </p>
      )}
      {lookup.data && (
        <div role="status" className="rounded-xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-800">Giá áp dụng</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">
            {formatCurrency(lookup.data.amount)}
          </p>
          <p className="mt-2 text-xs text-emerald-700">
            Nguồn giá:{' '}
            {channels[lookup.data.priceChannel] || lookup.data.priceChannel}
          </p>
          {!lookup.data.hasValidStandardPrice && (
            <p className="mt-2 text-sm text-amber-800">
              Món này chưa có giá tiêu chuẩn hợp lệ.
            </p>
          )}
        </div>
      )}
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
        disabled={lookup.isPending || !items.length}
      >
        {lookup.isPending ? 'Đang kiểm tra…' : 'Kiểm tra giá'}
      </button>
    </form>
  )
}
