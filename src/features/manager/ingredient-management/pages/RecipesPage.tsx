import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Badge,
  fieldClass,
  PageHeading,
  Panel,
  primaryButton,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { QueryState } from '../../menu-management/components/QueryState'
import { useItemChoices } from '../../menu-management/hooks/useItemChoices'
import { dateLabel } from '../../menu-management/utils/price'
import { IngredientTabs } from '../components/IngredientTabs'
import { RecipeDetails } from '../components/RecipeDetails'
import { RecipeForm } from '../components/RecipeForm'
import { useIngredientChoices } from '../hooks/useIngredients'
import { useRecipes } from '../hooks/useRecipes'
import { useUnits } from '../hooks/useUnits'
import { recipeStatus } from '../utils/recipe'

export function RecipesPage() {
  const [params, setParams] = useSearchParams()
  const itemId = params.get('itemId') || ''
  const [versionId, setVersionId] = useState('')
  const [create, setCreate] = useState(false)
  const items = useItemChoices()
  const recipes = useRecipes(itemId)
  const ingredients = useIngredientChoices()
  const units = useUnits()
  const sorted = [...(recipes.data || [])].sort((a, b) => b.version - a.version)
  const selected =
    sorted.find((recipe) => recipe.recipeVersionId === versionId) || sorted[0]
  return (
    <>
      <PageHeading
        eyebrow="Ingredients & Food Cost"
        title="Recipes & BOM"
        description="Define ingredient quantities per portion and keep a version history of each recipe."
        action={
          <button
            className={primaryButton}
            disabled={!itemId || !recipes.isSuccess}
            onClick={() => setCreate(true)}
          >
            Create recipe version
          </button>
        }
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
              value={itemId}
              className={fieldClass}
              onChange={(event) => {
                setParams(
                  event.target.value ? { itemId: event.target.value } : {},
                )
                setVersionId('')
              }}
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
          Select a menu item to view its recipe history.
        </Panel>
      ) : (
        <QueryState
          pending={recipes.isPending}
          error={recipes.error}
          retry={() => void recipes.refetch()}
        >
          {!sorted.length ? (
            <Panel className="space-y-3 p-10 text-center">
              <h2 className="font-semibold">No recipe yet</h2>
              <p className="text-sm text-slate-500">
                Create the first recipe version to define ingredients for one
                portion.
              </p>
              <button className={primaryButton} onClick={() => setCreate(true)}>
                Create first recipe
              </button>
            </Panel>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
              <Panel className="p-4">
                <h2 className="mb-3 font-semibold">Version history</h2>
                <div className="space-y-2">
                  {sorted.map((recipe) => (
                    <button
                      key={recipe.recipeVersionId}
                      onClick={() => setVersionId(recipe.recipeVersionId)}
                      className={`block w-full rounded-xl border p-3 text-left ${selected?.recipeVersionId === recipe.recipeVersionId ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">
                          Version {recipe.version}
                        </span>
                        <Badge
                          tone={
                            recipeStatus(recipe) === 'Active'
                              ? 'green'
                              : 'slate'
                          }
                        >
                          {recipeStatus(recipe)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {dateLabel(recipe.effectiveFrom)}
                      </p>
                    </button>
                  ))}
                </div>
              </Panel>
              <Panel className="p-5">
                <QueryState
                  pending={ingredients.isPending || units.isPending}
                  error={ingredients.error || units.error}
                  retry={() => {
                    void ingredients.refetch()
                    void units.refetch()
                  }}
                >
                  {selected && (
                    <RecipeDetails
                      recipe={selected}
                      ingredients={ingredients.data || []}
                      units={units.data || []}
                    />
                  )}
                </QueryState>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <button
                    className={secondaryButton}
                    onClick={() => setCreate(true)}
                  >
                    Use this version as a template
                  </button>
                  <Link
                    className={secondaryButton}
                    to={`/manager/food-cost?itemId=${itemId}`}
                  >
                    View food cost
                  </Link>
                </div>
              </Panel>
            </div>
          )}
        </QueryState>
      )}
      {create && itemId && (
        <Modal
          title="Create recipe version"
          size="wide"
          closeLabel="Close"
          onClose={() => setCreate(false)}
        >
          <QueryState
            pending={ingredients.isPending || units.isPending}
            error={ingredients.error || units.error}
            retry={() => {
              void ingredients.refetch()
              void units.refetch()
            }}
          >
            <RecipeForm
              itemId={itemId}
              source={selected}
              latestStart={sorted[0]?.effectiveFrom}
              ingredients={ingredients.data || []}
              units={units.data || []}
              close={() => {
                setCreate(false)
                setVersionId('')
              }}
            />
          </QueryState>
        </Modal>
      )}
    </>
  )
}
