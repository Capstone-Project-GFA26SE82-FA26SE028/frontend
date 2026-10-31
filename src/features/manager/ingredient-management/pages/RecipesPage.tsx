import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import {
  fieldClass,
  PageHeading,
  primaryButton,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
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
        eyebrow="Nguyên liệu và giá vốn"
        title="Công thức và định mức"
        description="Thiết lập định mức nguyên liệu cho mỗi phần ăn và lưu lịch sử phiên bản công thức."
        action={
          <button
            className={primaryButton}
            disabled={!itemId || !recipes.isSuccess}
            onClick={() => setCreate(true)}
          >
            Tạo phiên bản công thức
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
            Món ăn
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
              <option value="">Chọn món ăn</option>
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
          Chọn món ăn để xem lịch sử công thức.
        </Panel>
      ) : (
        <QueryState
          pending={recipes.isPending}
          error={recipes.error}
          retry={() => void recipes.refetch()}
        >
          {!sorted.length ? (
            <Panel className="space-y-3 p-10 text-center">
              <h2 className="font-semibold">Chưa có công thức</h2>
              <p className="text-sm text-slate-500">
                Tạo phiên bản công thức đầu tiên để thiết lập nguyên liệu cho
                một phần ăn.
              </p>
              <button className={primaryButton} onClick={() => setCreate(true)}>
                Tạo công thức đầu tiên
              </button>
            </Panel>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
              <Panel className="p-4">
                <h2 className="mb-3 font-semibold">Lịch sử phiên bản</h2>
                <div className="space-y-2">
                  {sorted.map((recipe) => (
                    <button
                      key={recipe.recipeVersionId}
                      onClick={() => setVersionId(recipe.recipeVersionId)}
                      className={`block w-full rounded-xl border p-3 text-left ${selected?.recipeVersionId === recipe.recipeVersionId ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">
                          Phiên bản {recipe.version}
                        </span>
                        <Badge
                          tone={
                            recipeStatus(recipe) === 'Active'
                              ? 'green'
                              : 'slate'
                          }
                        >
                          {
                            {
                              Active: 'Đang hiệu lực',
                              Scheduled: 'Đã lên lịch',
                              Ended: 'Đã kết thúc',
                            }[recipeStatus(recipe)]
                          }
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
                    Dùng phiên bản này làm mẫu
                  </button>
                  <Link
                    className={secondaryButton}
                    to={`/manager/food-cost?itemId=${itemId}`}
                  >
                    Xem giá vốn
                  </Link>
                </div>
              </Panel>
            </div>
          )}
        </QueryState>
      )}
      {create && itemId && (
        <Modal
          title="Tạo phiên bản công thức"
          size="wide"
          closeLabel="Đóng"
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
