import { Badge } from '../../../admin/components/AdminUI'
import { tableClass } from '../../menu-management/constants/styles'
import { dateLabel } from '../../menu-management/utils/price'
import type { Ingredient, Recipe, Unit } from '../types/ingredient'
import { recipeStatus } from '../utils/recipe'

export function RecipeDetails({
  recipe,
  ingredients,
  units,
}: {
  recipe: Recipe
  ingredients: Ingredient[]
  units: Unit[]
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Phiên bản công thức {recipe.version}
          </h2>
          <p className="mt-1 text-xs leading-6 text-slate-500">
            Từ {dateLabel(recipe.effectiveFrom)}
            {recipe.effectiveTo
              ? ` · Đến ${dateLabel(recipe.effectiveTo)}`
              : ' · No end date'}{' '}
            (UTC+7)
          </p>
        </div>
        <Badge tone={recipeStatus(recipe) === 'Active' ? 'green' : 'slate'}>
          {
            {
              Active: 'Đang hiệu lực',
              Scheduled: 'Đã lên lịch',
              Ended: 'Đã kết thúc',
            }[recipeStatus(recipe)]
          }
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead className="bg-slate-50">
            <tr>
              <th>Nguyên liệu</th>
              <th>Số lượng / phần</th>
              <th>Số lượng cơ sở đã lưu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recipe.ingredients.map((line) => (
              <tr key={line.ingredientRef}>
                <td>
                  {ingredients.find(
                    (i) => i.ingredientId === line.ingredientRef,
                  )?.ingredientName || line.ingredientRef}
                </td>
                <td>
                  {line.quantity.toLocaleString('en-GB')}{' '}
                  {units.find((u) => u.unitId === line.unitRef)?.code ||
                    line.unitRef}
                </td>
                <td>
                  {line.baseQuantitySnapshot.toLocaleString('en-GB')}{' '}
                  {
                    ingredients.find(
                      (i) => i.ingredientId === line.ingredientRef,
                    )?.baseUnit
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {recipe.instructions && (
        <div>
          <h3 className="text-sm font-semibold">Hướng dẫn chế biến</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-500">
            {recipe.instructions}
          </p>
        </div>
      )}
      {recipe.media.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold">Tài liệu chế biến</h3>
          <ul className="mt-2 space-y-2">
            {[...recipe.media]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((media, index) =>
                /^https?:\/\//i.test(media.url) ? (
                  <li key={index}>
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sm text-emerald-700 underline"
                    >
                      {media.mediaType}: {media.url}
                    </a>
                  </li>
                ) : (
                  <li key={index} className="break-all text-sm text-slate-500">
                    {media.mediaType}: {media.url}
                  </li>
                ),
              )}
          </ul>
        </div>
      )}
    </div>
  )
}
