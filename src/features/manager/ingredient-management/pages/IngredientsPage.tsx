import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { useDebounce } from '../../../../hooks/useDebounce'
import {
  Badge,
  ConfirmAction,
  PageHeading,
  Pagination,
  Panel,
  SearchField,
  fieldClass,
  primaryButton,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { QueryState } from '../../menu-management/components/QueryState'
import { tableClass } from '../../menu-management/constants/styles'
import { IngredientForm } from '../components/IngredientForm'
import { IngredientTabs } from '../components/IngredientTabs'
import { useIngredientMutation } from '../hooks/useIngredientMutation'
import { useIngredients } from '../hooks/useIngredients'
import { useUnits } from '../hooks/useUnits'
import type { Ingredient } from '../types/ingredient'

export function IngredientsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [lowStock, setLowStock] = useState(false)
  const [page, setPage] = useState(1)
  const query = useDebounce(search)
  const [form, setForm] = useState<{ ingredient?: Ingredient } | null>(null)
  const [target, setTarget] = useState<Ingredient | null>(null)
  const list = useIngredients(query, status, lowStock, page)
  const units = useUnits()
  const mutation = useIngredientMutation(() => setTarget(null))
  return (
    <>
      <PageHeading
        eyebrow="Ingredients & Food Cost"
        title="Ingredients"
        description="Manage raw ingredients, base units, and low-stock thresholds."
        action={
          <button className={primaryButton} onClick={() => setForm({})}>
            <Icon name="plus" size={18} />
            Add ingredient
          </button>
        }
      />
      <IngredientTabs />
      <Panel>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Search by ingredient name or code…"
          />
          <select
            aria-label="Ingredient status"
            className={`${fieldClass} sm:w-44`}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(event) => {
                setLowStock(event.target.checked)
                setPage(1)
              }}
            />
            Low stock only
          </label>
          <button
            className={secondaryButton}
            onClick={() => void list.refetch()}
          >
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
                  <th>Ingredient</th>
                  <th>Base unit</th>
                  <th>Stock on hand</th>
                  <th>Alert threshold</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.data?.items.map((ingredient) => (
                  <tr
                    key={ingredient.ingredientId}
                    className="hover:bg-emerald-50/30"
                  >
                    <td>
                      <p className="font-semibold">
                        {ingredient.ingredientName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {ingredient.ingredientCode}
                      </p>
                    </td>
                    <td>{ingredient.baseUnit}</td>
                    <td>
                      <p>{ingredient.stockQuantity.toLocaleString('en-GB')}</p>
                      {ingredient.isLowStock && (
                        <Badge
                          tone={ingredient.stockQuantity <= 0 ? 'red' : 'amber'}
                        >
                          {ingredient.stockQuantity <= 0
                            ? 'Out of stock'
                            : 'Low stock'}
                        </Badge>
                      )}
                    </td>
                    <td>
                      {ingredient.lowStockThreshold.toLocaleString('en-GB')}
                    </td>
                    <td>
                      <Badge tone={ingredient.isActive ? 'green' : 'slate'}>
                        {ingredient.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link
                          className={secondaryButton}
                          to={`/manager/units?ingredientId=${ingredient.ingredientId}`}
                        >
                          Units
                        </Link>
                        <button
                          className={secondaryButton}
                          onClick={() => setForm({ ingredient })}
                          aria-label={`Edit ${ingredient.ingredientName}`}
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          className={secondaryButton}
                          onClick={() => setTarget(ingredient)}
                        >
                          {ingredient.isActive ? 'Deactivate' : 'Activate'}
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
          page={page}
          size={10}
          total={list.data?.totalCount || 0}
          onPage={setPage}
        />
      </Panel>
      {form && (
        <Modal
          closeLabel="Close"
          title={form.ingredient ? 'Edit ingredient' : 'Add ingredient'}
          onClose={() => setForm(null)}
        >
          <QueryState
            pending={units.isPending}
            error={units.error}
            retry={() => void units.refetch()}
          >
            {units.data?.length || form.ingredient ? (
              <IngredientForm
                ingredient={form.ingredient}
                units={units.data || []}
                close={() => setForm(null)}
              />
            ) : (
              <div className="space-y-3 p-6">
                <p className="text-sm text-slate-500">
                  Create a measurement unit before adding ingredients.
                </p>
                <Link to="/manager/units" className={primaryButton}>
                  Manage units
                </Link>
              </div>
            )}
          </QueryState>
        </Modal>
      )}
      {target && (
        <ConfirmAction
          title={`${target.isActive ? 'Deactivate' : 'Activate'} ingredient?`}
          description={`Update the status of “${target.ingredientName}”? Existing inventory history will be preserved.`}
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          closeLabel="Close"
          disabled={mutation.isPending}
          onClose={() => {
            if (!mutation.isPending) setTarget(null)
          }}
          onConfirm={() =>
            mutation.mutate({
              method: 'patch',
              path: `/ingredients/${target.ingredientId}/status`,
              body: { isActive: !target.isActive },
            })
          }
        />
      )}
    </>
  )
}
