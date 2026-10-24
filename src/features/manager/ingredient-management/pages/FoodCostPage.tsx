import { Link, useSearchParams } from 'react-router-dom'
import {
  fieldClass,
  PageHeading,
  Panel,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { QueryState } from '../../menu-management/components/QueryState'
import { tableClass } from '../../menu-management/constants/styles'
import { useItemChoices } from '../../menu-management/hooks/useItemChoices'
import { dateLabel } from '../../menu-management/utils/price'
import { IngredientTabs } from '../components/IngredientTabs'
import { useIngredientChoices } from '../hooks/useIngredients'
import { useRecipes } from '../hooks/useRecipes'
import { activeRecipe } from '../utils/recipe'

export function FoodCostPage() {
  const [params, setParams] = useSearchParams()
  const itemId = params.get('itemId') || ''
  const items = useItemChoices()
  const ingredients = useIngredientChoices()
  const recipes = useRecipes(itemId)
  const recipe = activeRecipe(recipes.data || [])
  return (
    <>
      <PageHeading
        eyebrow="Ingredients & Food Cost"
        title="Food Cost"
        description="Review the ingredient requirements and cost readiness of one menu-item portion."
      />
      <IngredientTabs />
      <Panel className="mb-5 p-4">
        <QueryState
          pending={items.isPending}
          error={items.error}
          retry={() => void items.refetch()}
        >
          <label className="block space-y-2 text-sm font-medium">
            Menu item
            <select
              aria-label="Menu item for food cost"
              value={itemId}
              onChange={(event) =>
                setParams(
                  event.target.value ? { itemId: event.target.value } : {},
                )
              }
              className={fieldClass}
            >
              <option value="">Select a menu item</option>
              {items.data?.map((item) => (
                <option key={item.itemId} value={item.itemId}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </label>
        </QueryState>
      </Panel>
      {!itemId ? (
        <Panel className="p-12 text-center text-sm text-slate-500">
          Select a menu item to review its ingredient costs.
        </Panel>
      ) : (
        <QueryState
          pending={recipes.isPending || ingredients.isPending}
          error={recipes.error || ingredients.error}
          retry={() => {
            void recipes.refetch()
            void ingredients.refetch()
          }}
        >
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <Panel className="p-5">
              <p className="text-sm text-slate-500">Food cost / portion</p>
              <p className="mt-2 text-2xl font-bold text-slate-700">
                Not available
              </p>
              <p className="mt-2 text-xs text-amber-700">
                {recipe
                  ? 'Average ingredient costs are missing'
                  : 'A single active recipe is required'}
              </p>
            </Panel>
            <Panel className="p-5">
              <p className="text-sm text-slate-500">Active recipe</p>
              <p className="mt-2 text-2xl font-bold">
                {recipe ? `Version ${recipe.version}` : 'Not available'}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {recipe
                  ? `Effective from ${dateLabel(recipe.effectiveFrom)}`
                  : 'Check the recipe schedule'}
              </p>
            </Panel>
            <Panel className="p-5">
              <p className="text-sm text-slate-500">Ingredient lines</p>
              <p className="mt-2 text-2xl font-bold">
                {recipe?.ingredients.length ?? '—'}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Quantities are based on the saved recipe
              </p>
            </Panel>
          </div>
          <div
            role="status"
            className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
          >
            {recipe
              ? 'Average ingredient costs are not available. Food cost cannot be calculated until every ingredient has a valid cost. Missing costs are not treated as zero.'
              : 'No single active recipe was found for this item. Create or review the recipe schedule before calculating food cost.'}
          </div>
          {recipe && (
            <Panel>
              <div className="border-b border-slate-100 p-4">
                <h2 className="font-semibold">Ingredient cost breakdown</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Food cost = sum of base ingredient quantity × average cost per
                  base unit.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className={tableClass}>
                  <thead className="bg-slate-50">
                    <tr>
                      <th>Ingredient</th>
                      <th>Base quantity / portion</th>
                      <th>Average unit cost</th>
                      <th>Ingredient cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recipe.ingredients.map((line) => {
                      const ingredient = ingredients.data?.find(
                        (i) => i.ingredientId === line.ingredientRef,
                      )
                      return (
                        <tr key={line.ingredientRef}>
                          <td>
                            {ingredient?.ingredientName || line.ingredientRef}
                          </td>
                          <td>
                            {line.baseQuantitySnapshot.toLocaleString('en-GB')}{' '}
                            {ingredient?.baseUnit}
                          </td>
                          <td className="text-amber-700">Not available</td>
                          <td className="text-slate-400">—</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
          <Link
            to={`/manager/recipes?itemId=${itemId}`}
            className={`${secondaryButton} mt-5`}
          >
            Manage recipe
          </Link>
        </QueryState>
      )}
    </>
  )
}
