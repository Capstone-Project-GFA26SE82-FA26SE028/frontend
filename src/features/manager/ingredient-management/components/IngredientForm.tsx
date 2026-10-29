import { Field, fieldClass } from '../../../admin/components/AdminUI'
import { FormActions } from '../../menu-management/components/FormActions'
import { useIngredientMutation } from '../hooks/useIngredientMutation'
import type { Ingredient, Unit } from '../types/ingredient'
import { MutationError } from './MutationError'

export function IngredientForm({
  ingredient,
  units,
  close,
}: {
  ingredient?: Ingredient
  units: Unit[]
  close: () => void
}) {
  const mutation = useIngredientMutation(close)
  return (
    <form
      className="space-y-5 p-6"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        mutation.mutate({
          method: ingredient ? 'put' : 'post',
          path: ingredient
            ? `/ingredients/${ingredient.ingredientId}`
            : '/ingredients',
          body: {
            ingredientName: String(data.get('name')).trim(),
            baseUnit: ingredient?.baseUnit || data.get('unit'),
            lowStockThreshold: Number(data.get('threshold')),
          },
        })
      }}
    >
      <Field label="Tên nguyên liệu *">
        <input
          name="name"
          required
          autoFocus
          maxLength={255}
          defaultValue={ingredient?.ingredientName}
          className={fieldClass}
        />
      </Field>
      <Field label="Đơn vị cơ sở *">
        <select
          name="unit"
          disabled={Boolean(ingredient)}
          required
          defaultValue={ingredient?.baseUnit || ''}
          className={fieldClass}
        >
          <option value="" disabled>
            Chọn đơn vị
          </option>
          {ingredient &&
            !units.some((unit) => unit.code === ingredient.baseUnit) && (
              <option value={ingredient.baseUnit}>{ingredient.baseUnit}</option>
            )}
          {units.map((unit) => (
            <option key={unit.unitId} value={unit.code}>
              {unit.name} ({unit.code})
            </option>
          ))}
        </select>
      </Field>
      <p className="text-xs leading-5 text-slate-500">
        Không thể đổi đơn vị cơ sở sau khi tạo. Số lượng tồn kho và công thức sử
        dụng đơn vị này.
      </p>
      <Field label="Ngưỡng cảnh báo tồn kho *">
        <input
          type="number"
          name="threshold"
          required
          min="0"
          step="0.000001"
          max="999999999999.999999"
          defaultValue={ingredient?.lowStockThreshold ?? 0}
          className={fieldClass}
        />
      </Field>
      {!ingredient && (
        <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          Nguyên liệu mới có tồn kho bằng 0. Thay đổi tồn kho được ghi nhận qua
          các giao dịch kho.
        </p>
      )}
      <MutationError error={mutation.error} />
      <FormActions pending={mutation.isPending} close={close} />
    </form>
  )
}
