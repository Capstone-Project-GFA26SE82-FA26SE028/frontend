import { Field, fieldClass } from '../../../admin/components/AdminUI'
import { FormActions } from '../../menu-management/components/FormActions'
import { QueryState } from '../../menu-management/components/QueryState'
import { useIngredientMutation } from '../hooks/useIngredientMutation'
import { useConversions } from '../hooks/useUnits'
import type { Ingredient, Unit } from '../types/ingredient'
import { MutationError } from './MutationError'

export function ConversionForm({
  ingredient,
  units,
  close,
}: {
  ingredient: Ingredient
  units: Unit[]
  close: () => void
}) {
  const conversions = useConversions(ingredient.ingredientId)
  const mutation = useIngredientMutation(close)
  return (
    <QueryState
      pending={conversions.isPending}
      error={conversions.error}
      retry={() => void conversions.refetch()}
    >
      <form
        className="space-y-5 p-6"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          mutation.mutate({
            method: 'put',
            path: `/ingredients/${ingredient.ingredientId}/units/${data.get('unit')}`,
            body: { conversionFactor: Number(data.get('factor')) },
          })
        }}
      >
        <p className="text-sm text-slate-500">
          For <strong>{ingredient.ingredientName}</strong>, base unit:{' '}
          <strong>{ingredient.baseUnit}</strong>.
        </p>
        <Field label="Purchase / recipe unit *">
          <select name="unit" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select a unit
            </option>
            {units.map((unit) => (
              <option key={unit.unitId} value={unit.unitId}>
                {unit.name} ({unit.code})
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={`Base units (${ingredient.baseUnit}) per selected unit *`}
        >
          <input
            name="factor"
            type="number"
            min="0.000001"
            step="0.000001"
            max="999999999999.999999"
            required
            className={fieldClass}
            placeholder="e.g. 1000"
          />
        </Field>
        <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
          Example: if the base unit is g, set kg to 1000. The base unit itself
          must have a factor of 1. Existing receipt and recipe snapshots are
          preserved.
        </p>
        <MutationError error={mutation.error} />
        <FormActions
          pending={mutation.isPending || !units.length}
          close={close}
        />
      </form>
    </QueryState>
  )
}
