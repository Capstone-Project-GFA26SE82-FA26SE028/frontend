import { formatCurrency } from '../../../../utils/currency'
import {
  Field,
  fieldClass,
  primaryButton,
} from '../../../admin/components/AdminUI'
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
      <Field label="Menu item *">
        <select
          name="item"
          defaultValue={defaultItemId}
          required
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
      <Field label="Sales channel">
        <select name="channel" className={fieldClass}>
          {Object.entries(channels)
            .filter(([v]) => v !== 'AllChannels')
            .map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
        </select>
      </Field>
      <Field label="Date and time (UTC+7) *">
        <input
          name="at"
          type="datetime-local"
          required
          defaultValue={localInput(new Date().toISOString())}
          className={fieldClass}
        />
      </Field>
      {lookup.isError && (
        <p role="alert" className="text-sm text-rose-700">
          {catalogError(lookup.error)}
        </p>
      )}
      {lookup.data && (
        <div role="status" className="rounded-xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-800">Applied price</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">
            {formatCurrency(lookup.data.amount)}
          </p>
          <p className="mt-2 text-xs text-emerald-700">
            Price source:{' '}
            {channels[lookup.data.priceChannel] || lookup.data.priceChannel}
          </p>
          {!lookup.data.hasValidStandardPrice && (
            <p className="mt-2 text-sm text-amber-800">
              This item does not have a valid standard price.
            </p>
          )}
        </div>
      )}
      <button
        type="submit"
        className={primaryButton}
        disabled={lookup.isPending || !items.length}
      >
        {lookup.isPending ? 'Checking…' : 'Check price'}
      </button>
    </form>
  )
}
