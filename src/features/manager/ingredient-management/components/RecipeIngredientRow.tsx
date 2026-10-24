import { fieldClass, secondaryButton } from '../../../admin/components/AdminUI'
import { catalogError } from '../../menu-management/api/catalogApi'
import { useConversions } from '../hooks/useUnits'
import type { Ingredient, RecipeLine, Unit } from '../types/ingredient'

export function RecipeIngredientRow({
  line,
  ingredients,
  units,
  index,
  update,
  remove,
}: {
  line: RecipeLine
  ingredients: Ingredient[]
  units: Unit[]
  index: number
  update: (value: RecipeLine) => void
  remove: () => void
}) {
  const conversions = useConversions(line.ingredientRef)
  const allowed = units.filter((unit) =>
    conversions.data?.some((c) => c.unitId === unit.unitId),
  )
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 p-3">
      <div className="grid items-end gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <label className="space-y-1 text-sm">
          <span>Ingredient {index + 1} *</span>
          <select
            required
            className={fieldClass}
            value={line.ingredientRef}
            onChange={(event) =>
              update({
                ...line,
                ingredientRef: event.target.value,
                unitRef: '',
              })
            }
          >
            <option value="" disabled>
              Select ingredient
            </option>
            {ingredients
              .filter(
                (i) => i.isActive || i.ingredientId === line.ingredientRef,
              )
              .map((i) => (
                <option
                  key={i.ingredientId}
                  disabled={!i.isActive}
                  value={i.ingredientId}
                >
                  {i.ingredientName}
                  {!i.isActive ? ' · Inactive' : ''}
                </option>
              ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>Unit *</span>
          <select
            required
            disabled={!line.ingredientRef || conversions.isPending}
            className={fieldClass}
            value={line.unitRef}
            onChange={(event) =>
              update({ ...line, unitRef: event.target.value })
            }
          >
            <option value="" disabled>
              {line.ingredientRef && conversions.isPending
                ? 'Loading…'
                : 'Select unit'}
            </option>
            {allowed.map((unit) => (
              <option key={unit.unitId} value={unit.unitId}>
                {unit.code}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>Quantity *</span>
          <input
            required
            type="number"
            min="0.000001"
            max="999999999999.999999"
            step="0.000001"
            value={line.quantity}
            onChange={(event) =>
              update({ ...line, quantity: event.target.value })
            }
            className={fieldClass}
          />
        </label>
        <button
          type="button"
          aria-label={`Remove ingredient ${index + 1}`}
          className={secondaryButton}
          onClick={remove}
        >
          Remove
        </button>
      </div>
      {line.ingredientRef && conversions.isError && (
        <p role="alert" className="text-sm text-rose-700">
          {catalogError(conversions.error)}{' '}
          <button
            type="button"
            className="underline"
            onClick={() => void conversions.refetch()}
          >
            Retry
          </button>
        </p>
      )}
      {line.ingredientRef && conversions.isSuccess && !allowed.length && (
        <p className="text-xs text-amber-700">
          No usable units. Register the base unit or configure a conversion in
          Units & Conversions.
        </p>
      )}
    </div>
  )
}
