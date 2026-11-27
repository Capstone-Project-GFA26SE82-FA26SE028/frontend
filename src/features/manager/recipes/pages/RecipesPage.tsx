import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'

import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { QueryState } from '../components/QueryState'
import { useItemChoices } from '../hooks/useItemChoices'
import { useOptionChoices } from '../hooks/useOptionChoices'
import { Icon } from '../../../../components/Icon/Icon'
import { dateLabel } from '../utils/price'
import { IngredientTabs } from '../components/IngredientTabs'
import { RecipeDetails } from '../components/RecipeDetails'
import { RecipeForm } from '../components/RecipeForm'
import { useIngredientChoices } from '../hooks/useIngredients'
import { useRecipes } from '../hooks/useRecipes'
import { useUnits } from '../hooks/useUnits'
import { recipeStatus } from '../utils/recipe'

export function RecipesPage() {
  const [params] = useSearchParams()
  const option = !!params.get('optionId') || params.get('type') === 'options'
  const targetId = params.get(option ? 'optionId' : 'itemId') || ''
  return <RecipesWorkspace key={`${option}:${targetId}`} option={option} targetId={targetId} />
}

function RecipesWorkspace({ option, targetId: itemId }: { option: boolean; targetId: string }) {
  const [, setParams] = useSearchParams()
  const [versionId, setVersionId] = useState('')
  const [create, setCreate] = useState(false)
  const items = useItemChoices(!option)
  const options = useOptionChoices(option)
  const choices = option ? options : items
  const targetName = option
    ? options.data?.find((entry) => entry.optionId === itemId)?.optionName
    : items.data?.find((entry) => entry.itemId === itemId)?.itemName
  const recipes = useRecipes(itemId, option)
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
        description="Quản lý riêng công thức và định mức nguyên liệu cho món ăn và từng tùy chọn món."
        action={
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
            disabled={!itemId || !targetName || !recipes.isSuccess}
            onClick={() => setCreate(true)}
          >
            Tạo phiên bản công thức
          </button>
        }
      />
      <IngredientTabs />
      <nav aria-label="Loại công thức" className="mb-5 grid gap-3 sm:grid-cols-2">
        {[
          { option: false, title: 'Công thức món ăn', description: 'Định mức nguyên liệu cho một phần món ăn.', icon: 'utensils' },
          { option: true, title: 'Công thức tùy chọn', description: 'Định mức nguyên liệu cho một đơn vị tùy chọn.', icon: 'settings' },
        ].map((tab) => (
          <button
            key={String(tab.option)}
            type="button"
            aria-pressed={option === tab.option}
            onClick={() => {
              if (option !== tab.option) setParams(tab.option ? { type: 'options' } : {})
            }}
            className={`flex min-h-24 items-center gap-4 rounded-2xl border p-5 text-left transition-colors ${option === tab.option ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-slate-50'}`}
          >
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${option === tab.option ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'}`}><Icon name={tab.icon} size={22} /></span>
            <span><span className="block font-semibold">{tab.title}</span><span className="mt-1 block text-sm opacity-80">{tab.description}</span></span>
            {option === tab.option && <span className="ml-auto"><Icon name="check" size={20} /></span>}
          </button>
        ))}
      </nav>
        <Panel className="mb-5 p-4">
          <QueryState
            pending={choices.isPending}
            error={choices.error}
            retry={() => void choices.refetch()}
          >
            <label className="block space-y-2 text-sm font-medium">
              {option ? 'Tùy chọn món' : 'Món ăn'}
              <select
                value={itemId}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                onChange={(event) => {
                  setParams(option
                    ? { type: 'options', ...(event.target.value ? { optionId: event.target.value } : {}) }
                    : event.target.value ? { itemId: event.target.value } : {})
                }}
              >
                <option value="">{option ? 'Chọn tùy chọn món' : 'Chọn món ăn'}</option>
                {option ? [...new Set(options.data?.map((entry) => entry.optionGroupId))].map((groupId) => (
                  <optgroup key={groupId} label={options.data?.find((entry) => entry.optionGroupId === groupId)?.groupName}>
                    {options.data?.filter((entry) => entry.optionGroupId === groupId).map((entry) => <option key={entry.optionId} value={entry.optionId}>{entry.optionName}</option>)}
                  </optgroup>
                )) : items.data?.map((item) => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.itemName}
                  </option>
                ))}
              </select>
            </label>
            {!choices.isPending && !choices.error && !choices.data?.length && (
              <p className="mt-3 text-sm text-slate-500">
                {option ? 'Chưa có tùy chọn món.' : 'Chưa có món ăn.'}{' '}
                <Link className="font-medium text-emerald-700 underline" to={option ? '/manager/menu/options' : '/manager/menu/items'}>
                  {option ? 'Quản lý tùy chọn món' : 'Quản lý món ăn'}
                </Link>
              </p>
            )}
            {targetName && <p className="mt-3 text-sm text-slate-500">Đang quản lý công thức {option ? 'tùy chọn' : 'món ăn'}: <strong className="text-slate-800">{targetName}</strong></p>}
          </QueryState>
        </Panel>
      {!itemId ? (
        <Panel className="p-12 text-center text-sm text-slate-500">
          {option ? 'Chọn tùy chọn món để xem định mức nguyên liệu và lịch sử công thức của tùy chọn.' : 'Chọn món ăn để xem định mức nguyên liệu và lịch sử công thức của món.'}
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
                {option ? 'Tạo phiên bản đầu tiên để thiết lập nguyên liệu cho một đơn vị tùy chọn này.' : 'Tạo phiên bản đầu tiên để thiết lập nguyên liệu cho một phần món ăn này.'}
              </p>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
                onClick={() => setCreate(true)}
                disabled={!targetName}
              >
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
                      option={option}
                    />
                  )}
                </QueryState>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <button
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                    onClick={() => setCreate(true)}
                    disabled={!targetName}
                  >
                    Dùng phiên bản này làm mẫu
                  </button>
                  {!option && (
                    <Link
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                      to={`/manager/food-cost?itemId=${itemId}`}
                    >
                      Xem giá vốn
                    </Link>
                  )}
                </div>
              </Panel>
            </div>
          )}
        </QueryState>
      )}
      {create && itemId && (
        <Modal
          title={option ? 'Tạo công thức tùy chọn' : 'Tạo công thức món ăn'}
          subtitle={targetName}
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
              option={option}
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
