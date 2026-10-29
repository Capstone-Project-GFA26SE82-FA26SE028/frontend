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
          Cho <strong>{ingredient.ingredientName}</strong>, đơn vị cơ sở:{' '}
          <strong>{ingredient.baseUnit}</strong>.
        </p>
        <Field label="Đơn vị mua hàng / công thức *">
          <select name="unit" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Chọn đơn vị
            </option>
            {units.map((unit) => (
              <option key={unit.unitId} value={unit.unitId}>
                {unit.name} ({unit.code})
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={`Số đơn vị cơ sở (${ingredient.baseUnit}) trên mỗi đơn vị đã chọn *`}
        >
          <input
            name="factor"
            type="number"
            min="0.000001"
            step="0.000001"
            max="999999999999.999999"
            required
            className={fieldClass}
            placeholder="Ví dụ: 1000"
          />
        </Field>
        <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
          Ví dụ: nếu đơn vị cơ sở là g, đặt hệ số kg là 1000. Đơn vị cơ sở phải
          có hệ số 1. Dữ liệu đã lưu trên phiếu nhập và công thức được giữ
          nguyên.
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
