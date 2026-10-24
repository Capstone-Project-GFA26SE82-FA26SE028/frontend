import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { useDebounce } from '../../../../hooks/useDebounce'
import {
  Badge,
  ConfirmAction,
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
import { tableClass } from '../constants/styles'
import { useCatalogMutation } from '../hooks/useCatalogMutation'
import { useCategories } from '../hooks/useCategories'
import { type Category } from '../types/catalog'

export function CategoriesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const query = useDebounce(search, 300)
  const [form, setForm] = useState<{ category?: Category } | null>(null)
  const [target, setTarget] = useState<{
    category: Category
    action: 'status' | 'delete'
  } | null>(null)
  const list = useCategories(query, status, page)
  const mutation = useCatalogMutation(() => {
    setForm(null)
    setTarget(null)
  })
  return (
    <>
      <PageHeading
        eyebrow="Menu & Pricing"
        title="Categories"
        description="Organize the menu and manage category availability."
        action={
          <button className={primaryButton} onClick={() => setForm({})}>
            <Icon name="plus" size={18} />
            Add category
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
            placeholder="Search by category name or code…"
          />
          <select
            aria-label="Category status"
            className={`${fieldClass} sm:w-52`}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button
            className={secondaryButton}
            onClick={() => void list.refetch()}
            aria-label="Refresh categories"
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
                  <th>Category code</th>
                  <th>Category name</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.data?.items.map((category) => (
                  <tr
                    key={category.categoryId}
                    className="hover:bg-emerald-50/30"
                  >
                    <td className="text-slate-500">{category.categoryCode}</td>
                    <td className="font-semibold">{category.categoryName}</td>
                    <td>
                      <Badge tone={category.isActive ? 'green' : 'slate'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          className={secondaryButton}
                          onClick={() => setForm({ category })}
                          aria-label={`Edit ${category.categoryName}`}
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          className={secondaryButton}
                          onClick={() =>
                            setTarget({ category, action: 'status' })
                          }
                        >
                          {category.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className={`${secondaryButton} text-rose-600`}
                          onClick={() =>
                            setTarget({ category, action: 'delete' })
                          }
                          aria-label={`Delete ${category.categoryName}`}
                        >
                          <Icon name="trash" size={16} />
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
          title={form.category ? 'Edit category' : 'Add category'}
          onClose={() => {
            if (!mutation.isPending) setForm(null)
          }}
        >
          <form
            className="space-y-5 p-6"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              mutation.mutate({
                method: form.category ? 'put' : 'post',
                path: form.category
                  ? `/categories/${form.category.categoryId}`
                  : '/categories',
                body: { categoryName: String(data.get('name')).trim() },
              })
            }}
          >
            <Field label="Category name *">
              <input
                name="name"
                autoFocus
                required
                maxLength={255}
                defaultValue={form.category?.categoryName}
                className={fieldClass}
                placeholder="e.g. Main courses"
              />
            </Field>
            <FormActions
              pending={mutation.isPending}
              close={() => setForm(null)}
            />
          </form>
        </Modal>
      )}
      {target && (
        <ConfirmAction
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          closeLabel="Close"
          title={
            target.action === 'delete'
              ? 'Delete category?'
              : 'Change category status?'
          }
          description={
            target.action === 'delete'
              ? `Delete category “${target.category.categoryName}”? Only categories with no associated items can be deleted.`
              : `${target.category.isActive ? 'Deactivate' : 'Activate'} category “${target.category.categoryName}”? Categories with items still offered for sale cannot be deactivated.`
          }
          disabled={mutation.isPending}
          onClose={() => {
            if (!mutation.isPending) setTarget(null)
          }}
          onConfirm={() =>
            mutation.mutate({
              method: target.action === 'delete' ? 'delete' : 'patch',
              path: `/categories/${target.category.categoryId}${target.action === 'status' ? '/status' : ''}`,
              body:
                target.action === 'status'
                  ? { isActive: !target.category.isActive }
                  : undefined,
            })
          }
        />
      )}
    </>
  )
}
