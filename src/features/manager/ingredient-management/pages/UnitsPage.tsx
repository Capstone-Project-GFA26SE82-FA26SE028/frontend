import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Field,
  fieldClass,
  PageHeading,
  primaryButton,
} from '../../../admin/components/AdminUI'
import { Panel } from '../../../../components/Panel/Panel'
import { FormActions } from '../../menu-management/components/FormActions'
import { QueryState } from '../../menu-management/components/QueryState'
import { tableClass } from '../../menu-management/constants/styles'
import { ConversionForm } from '../components/ConversionForm'
import { IngredientTabs } from '../components/IngredientTabs'
import { MutationError } from '../components/MutationError'
import { useIngredientChoices } from '../hooks/useIngredients'
import { useIngredientMutation } from '../hooks/useIngredientMutation'
import { useConversions, useUnits } from '../hooks/useUnits'

export function UnitsPage() {
  const [params, setParams] = useSearchParams()
  const ingredientId = params.get('ingredientId') || ''
  const [create, setCreate] = useState(false)
  const [conversion, setConversion] = useState(false)
  const units = useUnits()
  const ingredients = useIngredientChoices()
  const conversions = useConversions(ingredientId)
  const selected = ingredients.data?.find(
    (i) => i.ingredientId === ingredientId,
  )
  const mutation = useIngredientMutation(() => setCreate(false))
  return (
    <>
      <PageHeading
        eyebrow="Nguyên liệu và giá vốn"
        title="Đơn vị và quy đổi"
        description="Thiết lập đơn vị đo và hệ số quy đổi riêng cho từng nguyên liệu."
        action={
          <button className={primaryButton} onClick={() => setCreate(true)}>
            Thêm đơn vị
          </button>
        }
      />
      <IngredientTabs />
      <div className="grid gap-5 xl:grid-cols-[1fr_1.5fr]">
        <Panel>
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-semibold">Đơn vị đo</h2>
            <p className="mt-1 text-sm text-slate-500">
              Đơn vị dùng chung cho nguyên liệu và công thức.
            </p>
          </div>
          <QueryState
            pending={units.isPending}
            error={units.error}
            retry={() => void units.refetch()}
            empty={!units.data?.length}
          >
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-slate-50">
                  <tr>
                    <th>Mã</th>
                    <th>Tên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {units.data?.map((unit) => (
                    <tr key={unit.unitId}>
                      <td className="font-semibold">{unit.code}</td>
                      <td>{unit.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </QueryState>
        </Panel>
        <Panel>
          <div className="space-y-3 border-b border-slate-100 p-4">
            <h2 className="font-semibold">Quy đổi nguyên liệu</h2>
            <QueryState
              pending={ingredients.isPending}
              error={ingredients.error}
              retry={() => void ingredients.refetch()}
            >
              <select
                aria-label="Chọn nguyên liệu để quy đổi"
                value={ingredientId}
                className={fieldClass}
                onChange={(event) =>
                  setParams(
                    event.target.value
                      ? { ingredientId: event.target.value }
                      : {},
                  )
                }
              >
                <option value="">Chọn nguyên liệu</option>
                {ingredients.data?.map((i) => (
                  <option key={i.ingredientId} value={i.ingredientId}>
                    {i.ingredientName} ({i.baseUnit})
                    {!i.isActive ? ' · Ngừng hoạt động' : ''}
                  </option>
                ))}
              </select>
            </QueryState>
            {selected && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Đơn vị cơ sở: <strong>{selected.baseUnit}</strong>
                </p>
                <button
                  className={primaryButton}
                  disabled={!units.data?.length}
                  onClick={() => setConversion(true)}
                >
                  Thiết lập quy đổi
                </button>
              </div>
            )}
          </div>
          {selected ? (
            <QueryState
              pending={conversions.isPending}
              error={conversions.error}
              retry={() => void conversions.refetch()}
              empty={!conversions.data?.length}
            >
              <div className="overflow-x-auto">
                <table className={tableClass}>
                  <thead className="bg-slate-50">
                    <tr>
                      <th>Đơn vị</th>
                      <th>Quy đổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {conversions.data?.map((c) => (
                      <tr key={c.unitId}>
                        <td>
                          {units.data?.find((u) => u.unitId === c.unitId)
                            ?.name || c.unitId}
                        </td>
                        <td>
                          1{' '}
                          {units.data?.find((u) => u.unitId === c.unitId)?.code}{' '}
                          = {c.conversionFactor.toLocaleString('en-GB')}{' '}
                          {selected.baseUnit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </QueryState>
          ) : (
            <p className="p-8 text-center text-sm text-slate-500">
              Chọn nguyên liệu để xem hệ số quy đổi.
            </p>
          )}
        </Panel>
      </div>
      {create && (
        <Modal
          title="Thêm đơn vị đo"
          closeLabel="Đóng"
          onClose={() => {
            if (!mutation.isPending) setCreate(false)
          }}
        >
          <form
            className="space-y-5 p-6"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              mutation.mutate({
                method: 'post',
                path: '/units',
                body: {
                  code: String(data.get('code')).trim().toLowerCase(),
                  name: String(data.get('name')).trim(),
                },
              })
            }}
          >
            <Field label="Mã đơn vị *">
              <input
                name="code"
                autoFocus
                required
                pattern="[A-Za-z0-9_]+"
                maxLength={50}
                placeholder="Ví dụ: kg"
                className={fieldClass}
              />
            </Field>
            <Field label="Tên đơn vị *">
              <input
                name="name"
                required
                maxLength={100}
                placeholder="Ví dụ: Kilôgam"
                className={fieldClass}
              />
            </Field>
            <MutationError error={mutation.error} />
            <FormActions
              pending={mutation.isPending}
              close={() => setCreate(false)}
            />
          </form>
        </Modal>
      )}
      {conversion && selected && (
        <Modal
          title="Thiết lập quy đổi đơn vị"
          closeLabel="Đóng"
          onClose={() => setConversion(false)}
        >
          <ConversionForm
            ingredient={selected}
            units={units.data || []}
            close={() => setConversion(false)}
          />
        </Modal>
      )}
    </>
  )
}
