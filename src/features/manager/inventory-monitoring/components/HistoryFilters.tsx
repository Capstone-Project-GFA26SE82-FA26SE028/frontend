import { Field, fieldClass } from '../../../admin/components/AdminUI'
import type { Ingredient } from '../../ingredient-management/types/ingredient'

export function HistoryFilters({
  ingredients,
  ingredientId,
  select,
  from,
  until,
  setFrom,
  setUntil,
}: {
  ingredients: Ingredient[]
  ingredientId: string
  select: (id: string) => void
  from: string
  until: string
  setFrom: (value: string) => void
  setUntil: (value: string) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
      <Field label="Nguyên liệu">
        <select
          value={ingredientId}
          onChange={(event) => select(event.target.value)}
          className={fieldClass}
        >
          <option value="">Chọn nguyên liệu</option>
          {ingredients.map((ingredient) => (
            <option
              key={ingredient.ingredientId}
              value={ingredient.ingredientId}
            >
              {ingredient.ingredientName} ({ingredient.baseUnit})
              {!ingredient.isActive ? ' · Ngừng hoạt động' : ''}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Từ ngày (UTC+7)">
        <input
          type="date"
          value={from}
          max={until || undefined}
          onChange={(event) => setFrom(event.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field label="Đến ngày (UTC+7)">
        <input
          type="date"
          value={until}
          min={from || undefined}
          onChange={(event) => setUntil(event.target.value)}
          className={fieldClass}
        />
      </Field>
      {from && until && from > until && (
        <p role="alert" className="text-sm text-rose-700 sm:col-span-3">
          The end date must be on or after the start date.
        </p>
      )}
    </div>
  )
}
