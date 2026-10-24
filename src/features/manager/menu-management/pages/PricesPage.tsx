import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { formatCurrency } from '../../../../utils/currency'
import {
  Badge,
  ConfirmAction,
  fieldClass,
  PageHeading,
  Pagination,
  Panel,
  primaryButton,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { MenuTabs } from '../components/MenuTabs'
import { PriceForm } from '../components/PriceForm'
import { PricePreview } from '../components/PricePreview'
import { QueryState } from '../components/QueryState'
import { channels } from '../constants/catalog'
import { tableClass } from '../constants/styles'
import { useCatalogMutation } from '../hooks/useCatalogMutation'
import { useItemChoices } from '../hooks/useItemChoices'
import { usePrices } from '../hooks/usePrices'
import type { Price, PriceFormTarget } from '../types/catalog'
import { dateLabel, priceState } from '../utils/price'

export function PricesPage() {
  const [params, setParams] = useSearchParams()
  const itemId = params.get('itemId') || ''
  const [channel, setChannel] = useState('')
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<PriceFormTarget | null>(null)
  const [deleting, setDeleting] = useState<Price | null>(null)
  const [preview, setPreview] = useState(false)
  const items = useItemChoices()
  const list = usePrices(itemId, channel, page)
  const mutation = useCatalogMutation(() => {
    setForm(null)
    setDeleting(null)
  })
  const name = (id: string) =>
    items.data?.find((i) => i.itemId === id)?.itemName || id
  return (
    <>
      <PageHeading
        eyebrow="Menu & Pricing"
        title="Pricing"
        description="Set standard prices and configure pricing by channel and time window."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className={secondaryButton}
              onClick={() => setPreview(true)}
            >
              <Icon name="eye" size={18} />
              Check applied price
            </button>
            <button
              className={primaryButton}
              onClick={() => setForm({ mode: 'create' })}
            >
              <Icon name="plus" size={18} />
              Add price
            </button>
          </div>
        }
      />
      <MenuTabs />
      <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
        <p className="font-semibold">Pricing priority</p>
        <p className="mt-1">
          Time window + channel → Time window → Channel → Standard price.
        </p>
        <p className="mt-1 text-emerald-800/80">
          Standard prices apply to all channels throughout the day. All times
          below use Vietnam time (UTC+7).
        </p>
      </div>
      <Panel>
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
          <select
            aria-label="Filter by item"
            className={`${fieldClass} sm:w-72`}
            value={itemId}
            onChange={(e) => {
              setParams(e.target.value ? { itemId: e.target.value } : {})
              setPage(1)
            }}
          >
            <option value="">All items</option>
            {items.data?.map((item) => (
              <option key={item.itemId} value={item.itemId}>
                {item.itemName}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by channel"
            className={`${fieldClass} sm:w-52`}
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All channel configurations</option>
            {Object.entries(channels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            className={`${secondaryButton} sm:ml-auto`}
            onClick={() => void list.refetch()}
          >
            <Icon name="activity" size={16} />
            Refresh
          </button>
        </div>
        <QueryState
          pending={list.isPending}
          error={list.error}
          retry={() => void list.refetch()}
          empty={!list.data?.items.length}
        >
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className="bg-slate-50/70">
                <tr>
                  <th>Item / Sales channel</th>
                  <th>Pricing</th>
                  <th>Effective period</th>
                  <th>Time window</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.data?.items.map((price) => {
                  const state = priceState(price)
                  return (
                    <tr key={price.priceId} className="hover:bg-emerald-50/30">
                      <td>
                        <p className="min-w-40 font-semibold">
                          {name(price.itemId)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {channels[price.channel] || price.channel}
                          {price.channel === 'AllChannels' && !price.dailyStart
                            ? ' · Standard price'
                            : ''}
                        </p>
                      </td>
                      <td className="whitespace-nowrap font-semibold text-emerald-800">
                        {formatCurrency(price.amount)}
                      </td>
                      <td className="whitespace-nowrap text-xs leading-6">
                        <p>From {dateLabel(price.effectiveFrom)}</p>
                        <p className="text-slate-400">
                          {price.effectiveTo
                            ? `Until ${dateLabel(price.effectiveTo)}`
                            : 'No end date'}
                        </p>
                      </td>
                      <td className="whitespace-nowrap">
                        {price.dailyStart
                          ? `${price.dailyStart.slice(0, 5)} – ${price.dailyEnd?.slice(0, 5)}`
                          : 'All day'}
                      </td>
                      <td>
                        <Badge tone={state.tone}>{state.label}</Badge>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          {state.label === 'Scheduled' ? (
                            <>
                              <button
                                className={secondaryButton}
                                onClick={() => setForm({ mode: 'edit', price })}
                              >
                                Edit
                              </button>
                              <button
                                className={`${secondaryButton} text-rose-600`}
                                aria-label={`Delete price ${name(price.itemId)}`}
                                onClick={() => setDeleting(price)}
                              >
                                <Icon name="trash" size={16} />
                              </button>
                            </>
                          ) : state.label !== 'Ended' ? (
                            <button
                              className={secondaryButton}
                              onClick={() =>
                                setForm({ mode: 'replace', price })
                              }
                            >
                              Replace price
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Saved in history
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </QueryState>
        <Pagination
          locale="en"
          total={list.data?.totalCount || 0}
          page={page}
          size={10}
          onPage={setPage}
        />
      </Panel>
      {form && (
        <Modal
          closeLabel="Close"
          title={
            form.mode === 'create'
              ? 'Add price'
              : form.mode === 'edit'
                ? 'Edit scheduled price'
                : 'Replace current price'
          }
          onClose={() => {
            if (!mutation.isPending) setForm(null)
          }}
        >
          <QueryState
            pending={items.isPending}
            error={items.error}
            retry={() => void items.refetch()}
          >
            <PriceForm
              target={form}
              items={items.data || []}
              defaultItemId={itemId}
              pending={mutation.isPending}
              close={() => setForm(null)}
              save={(body) => {
                const { itemId: selectedItem, ...terms } = body
                mutation.mutate({
                  method: form.mode === 'edit' ? 'put' : 'post',
                  path:
                    form.mode === 'create'
                      ? '/prices'
                      : `/prices/${form.price!.priceId}${form.mode === 'replace' ? '/replace' : ''}`,
                  body:
                    form.mode === 'replace'
                      ? { amount: body.amount, effectiveTo: body.effectiveTo }
                      : form.mode === 'edit'
                        ? terms
                        : { itemId: selectedItem, ...terms },
                })
              }}
            />
          </QueryState>
        </Modal>
      )}
      {deleting && (
        <ConfirmAction
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          closeLabel="Close"
          title="Delete scheduled price?"
          description={`Delete the ${formatCurrency(deleting.amount)} price for “${name(deleting.itemId)}”? Only prices that have not taken effect can be deleted.`}
          disabled={mutation.isPending}
          onClose={() => {
            if (!mutation.isPending) setDeleting(null)
          }}
          onConfirm={() =>
            mutation.mutate({
              method: 'delete',
              path: `/prices/${deleting.priceId}`,
            })
          }
        />
      )}
      {preview && (
        <Modal
          closeLabel="Close"
          title="Check applied price"
          onClose={() => setPreview(false)}
        >
          <QueryState
            pending={items.isPending}
            error={items.error}
            retry={() => void items.refetch()}
          >
            <PricePreview items={items.data || []} defaultItemId={itemId} />
          </QueryState>
        </Modal>
      )}
    </>
  )
}
