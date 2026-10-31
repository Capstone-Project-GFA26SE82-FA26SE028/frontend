import { Link, useSearchParams } from 'react-router-dom'
import {
  fieldClass,
  PageHeading,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { Panel } from '../../../../components/Panel/Panel'
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
        eyebrow="Nguyên liệu và giá vốn"
        title="Giá vốn món ăn"
        description="Xem nguyên liệu cần dùng và khả năng tính giá vốn cho một phần món ăn."
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
              aria-label="Món ăn cần tính giá vốn"
              value={itemId}
              onChange={(event) =>
                setParams(
                  event.target.value ? { itemId: event.target.value } : {},
                )
              }
              className={fieldClass}
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
          Chọn món ăn để xem chi phí nguyên liệu.
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
              <p className="text-sm text-slate-500">Giá vốn / phần</p>
              <p className="mt-2 text-2xl font-bold text-slate-700">
                Chưa có dữ liệu
              </p>
              <p className="mt-2 text-xs text-amber-700">
                {recipe
                  ? 'Thiếu giá nguyên liệu bình quân'
                  : 'Cần có một công thức đang hiệu lực'}
              </p>
            </Panel>
            <Panel className="p-5">
              <p className="text-sm text-slate-500">Công thức đang hiệu lực</p>
              <p className="mt-2 text-2xl font-bold">
                {recipe ? `Phiên bản ${recipe.version}` : 'Chưa có dữ liệu'}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {recipe
                  ? `Có hiệu lực từ ${dateLabel(recipe.effectiveFrom)}`
                  : 'Kiểm tra lịch công thức'}
              </p>
            </Panel>
            <Panel className="p-5">
              <p className="text-sm text-slate-500">Số dòng nguyên liệu</p>
              <p className="mt-2 text-2xl font-bold">
                {recipe?.ingredients.length ?? '—'}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Số lượng dựa trên công thức đã lưu
              </p>
            </Panel>
          </div>
          <div
            role="status"
            className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
          >
            {recipe
              ? 'Chưa có giá nguyên liệu bình quân. Chỉ tính được giá vốn khi mọi nguyên liệu đều có giá hợp lệ. Giá còn thiếu không được xem là 0.'
              : 'Chưa xác định được một công thức đang hiệu lực cho món này. Tạo hoặc kiểm tra lịch công thức trước khi tính giá vốn.'}
          </div>
          {recipe && (
            <Panel>
              <div className="border-b border-slate-100 p-4">
                <h2 className="font-semibold">Chi tiết chi phí nguyên liệu</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Food cost = sum of base ingredient quantity × average cost per
                  base unit.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className={tableClass}>
                  <thead className="bg-slate-50">
                    <tr>
                      <th>Nguyên liệu</th>
                      <th>Số lượng cơ sở / phần</th>
                      <th>Đơn giá bình quân</th>
                      <th>Chi phí nguyên liệu</th>
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
                          <td className="text-amber-700">Chưa có dữ liệu</td>
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
            Quản lý công thức
          </Link>
        </QueryState>
      )}
    </>
  )
}
