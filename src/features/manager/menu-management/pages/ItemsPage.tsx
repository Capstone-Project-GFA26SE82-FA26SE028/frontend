import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { useDebounce } from '../../../../hooks/useDebounce'
import {
  Badge,
  Field,
  fieldClass,
  PageHeading,
  Pagination,
  Panel,
  primaryButton,
  SearchField,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { FormActions } from '../components/FormActions'
import { MenuTabs } from '../components/MenuTabs'
import { QueryState } from '../components/QueryState'
import { availabilityLabels } from '../constants/catalog'
import { tableClass } from '../constants/styles'
import { useCatalogMutation } from '../hooks/useCatalogMutation'
import { useCategoryChoices } from '../hooks/useCategoryChoices'
import { useItems } from '../hooks/useItems'
import { type Item } from '../types/catalog'

export function ItemsPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const query = useDebounce(search, 300)
  const [form, setForm] = useState<{ item?: Item } | null>(null)
  const [target, setTarget] = useState<Item | null>(null)
  const categories = useCategoryChoices()
  const list = useItems(query, categoryId, status, page)
  const mutation = useCatalogMutation(() => {
    setForm(null)
    setTarget(null)
  })
  return (
    <>
      <PageHeading
        eyebrow="Menu & Pricing"
        title="Menu items"
        description="Manage menu item details and sales availability."
        action={
          <button className={primaryButton} onClick={() => setForm({})}>
            <Icon name="plus" size={18} />
            Add menu item
          </button>
        }
      />
      <MenuTabs />
      <Panel>
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
          <SearchField
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Search by item name or code…"
          />
          <select
            aria-label="Filter by category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value)
              setPage(1)
            }}
            className={`${fieldClass} sm:w-44`}
          >
            <option value="">All categories</option>
            {categories.data?.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by availability"
            className={`${fieldClass} sm:w-48`}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All statuses</option>
            {Object.entries(availabilityLabels).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          <button
            className={secondaryButton}
            onClick={() => void list.refetch()}
            aria-label="Refresh menu items"
          >
            <Icon name="activity" size={18} />
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
                  <th>Menu items</th>
                  <th>Categories</th>
                  <th>Availability</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.data?.items.map((item) => (
                  <tr key={item.itemId} className="hover:bg-emerald-50/30">
                    <td>
                      <div className="flex min-w-56 items-center gap-3">
                        <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-emerald-700">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="size-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <Icon name="utensils" size={22} />
                          )}
                        </span>
                        <div>
                          <p className="font-semibold">{item.itemName}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.itemCode}
                          </p>
                          {item.description && (
                            <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{item.categoryName}</td>
                    <td>
                      <Badge
                        tone={
                          item.availability === 'Available'
                            ? 'green'
                            : item.availability === 'OutOfStock'
                              ? 'amber'
                              : 'slate'
                        }
                      >
                        {availabilityLabels[item.availability]}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/manager/menu/prices?itemId=${item.itemId}`}
                          className={secondaryButton}
                        >
                          Pricing
                        </Link>
                        <button
                          className={secondaryButton}
                          aria-label={`Edit ${item.itemName}`}
                          onClick={() => setForm({ item })}
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          className={secondaryButton}
                          onClick={() => setTarget(item)}
                        >
                          Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
          title={form.item ? 'Edit menu item' : 'Add menu item'}
          onClose={() => {
            if (!mutation.isPending) setForm(null)
          }}
        >
          <form
            className="space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault()
              const data = new FormData(e.currentTarget)
              mutation.mutate({
                method: form.item ? 'put' : 'post',
                path: form.item ? `/items/${form.item.itemId}` : '/items',
                body: {
                  itemName: String(data.get('name')).trim(),
                  categoryId: data.get('category'),
                  description: String(data.get('description')).trim() || null,
                  imageUrl: String(data.get('image')).trim() || null,
                  ...(form.item ? { version: form.item.version } : {}),
                },
              })
            }}
          >
            <Field label="Item name *">
              <input
                name="name"
                required
                autoFocus
                maxLength={255}
                defaultValue={form.item?.itemName}
                className={fieldClass}
              />
            </Field>
            <QueryState
              pending={categories.isPending}
              error={categories.error}
              retry={() => void categories.refetch()}
            >
              <Field label="Category *">
                <select
                  name="category"
                  required
                  defaultValue={form.item?.categoryId || ''}
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.data
                    ?.filter(
                      (c) =>
                        c.isActive || c.categoryId === form.item?.categoryId,
                    )
                    .map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                        {!c.isActive ? ' (inactive)' : ''}
                      </option>
                    ))}
                </select>
              </Field>
            </QueryState>
            <Field label="Description">
              <textarea
                name="description"
                maxLength={2000}
                rows={3}
                defaultValue={form.item?.description || ''}
                className={fieldClass}
              />
            </Field>
            <Field label="Image URL">
              <input
                name="image"
                type="url"
                maxLength={2048}
                placeholder="https://…"
                defaultValue={form.item?.imageUrl || ''}
                className={fieldClass}
              />
            </Field>
            {!form.item && (
              <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
                New items are created as inactive. A valid standard price and an
                effective recipe are required before making an item available.
              </p>
            )}
            <FormActions
              pending={mutation.isPending || !categories.data}
              close={() => setForm(null)}
            />
          </form>
        </Modal>
      )}
      {target && (
        <Modal
          closeLabel="Close"
          title="Update availability"
          onClose={() => {
            if (!mutation.isPending) setTarget(null)
          }}
        >
          <form
            className="space-y-5 p-6"
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate({
                method: 'patch',
                path: `/items/${target.itemId}/status`,
                body: {
                  availability: new FormData(e.currentTarget).get('status'),
                  version: target.version,
                },
              })
            }}
          >
            <p className="font-semibold">{target.itemName}</p>
            <Field label="Availability">
              <select
                name="status"
                defaultValue={target.availability}
                className={fieldClass}
              >
                {Object.entries(availabilityLabels).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-500">
              Making an item available requires an active category, a valid
              standard price, and an effective recipe. Existing orders are
              unaffected.
            </p>
            <FormActions
              pending={mutation.isPending}
              close={() => setTarget(null)}
            />
          </form>
        </Modal>
      )}
    </>
  )
}
