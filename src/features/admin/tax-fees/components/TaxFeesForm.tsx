import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { FormEventHandler } from 'react'
import type { Fees } from '../schemas/taxFeeSchema'
import { Field, fieldClass, primaryButton } from '../../components/AdminUI'
import { Panel } from '../../../../components/Panel/Panel'
export function TaxFeesForm({
  register,
  errors,
  onSubmit,
  applyAt,
  busy,
  disabled,
}: {
  register: UseFormRegister<Fees>
  errors: FieldErrors<Fees>
  onSubmit: FormEventHandler<HTMLFormElement>
  applyAt: Fees['applyAt']
  busy: boolean
  disabled: boolean
}) {
  return (
    <Panel className="p-4 sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Cấu hình mới
      </h2>
      <form onSubmit={onSubmit}>
        <fieldset
          disabled={busy || disabled}
          className="space-y-4 disabled:opacity-60"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="VAT (%)" error={errors.vat?.message}>
              <input
                type="number"
                step="0.0001"
                min="0"
                max="100"
                {...register('vat', { valueAsNumber: true })}
                className={fieldClass}
              />
            </Field>
            <Field label="Phí dịch vụ (%)" error={errors.service?.message}>
              <input
                type="number"
                step="0.0001"
                min="0"
                max="100"
                {...register('service', { valueAsNumber: true })}
                className={fieldClass}
              />
            </Field>
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
            Áp dụng phí dịch vụ
            <span className="relative inline-flex shrink-0">
              <input
                type="checkbox"
                {...register('serviceEnabled')}
                className="peer sr-only"
              />
              <span className="h-6 w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-700 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 peer-focus-visible:ring-offset-2" />
              <span className="pointer-events-none absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
            </span>
          </label>
          <Field label="Áp dụng">
            <select {...register('applyAt')} className={fieldClass}>
              <option value="now">Áp dụng ngay</option>
              <option value="scheduled">Hẹn thời gian</option>
            </select>
          </Field>
          {applyAt === 'scheduled' && (
            <Field
              label="Thời điểm hiệu lực"
              error={errors.effectiveAt?.message}
            >
              <input
                type="datetime-local"
                {...register('effectiveAt')}
                className={fieldClass}
              />
            </Field>
          )}
          {errors.root && (
            <p role="alert" className="text-rose-600">
              {errors.root.message}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400">Lưu thành phiên bản mới.</p>
            <button
              type="submit"
              className={primaryButton + ' w-full sm:w-auto'}
            >
              {busy ? 'Đang lưu…' : 'Lưu cấu hình'}
            </button>
          </div>
        </fieldset>
      </form>
    </Panel>
  )
}
