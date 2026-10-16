import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { FormEventHandler } from 'react'
import type { Fees } from '../schema'
import {
  Panel,
  Field,
  fieldClass,
  primaryButton,
} from '../../components/AdminUI'
export function TaxFeesForm({
  register,
  errors,
  onSubmit,
}: {
  register: UseFormRegister<Fees>
  errors: FieldErrors<Fees>
  onSubmit: FormEventHandler<HTMLFormElement>
}) {
  return (
    <Panel className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Thiết lập mức thu mới
      </h2>
      <p className="mb-6 mt-1 text-sm leading-6 text-slate-500">
        Điều chỉnh tỷ lệ và chọn thời điểm bắt đầu áp dụng.
      </p>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="VAT (%)" error={errors.vat?.message}>
            <input
              type="number"
              step="0.1"
              {...register('vat', { valueAsNumber: true })}
              className={fieldClass}
            />
          </Field>
          <Field label="Phí dịch vụ (%)" error={errors.service?.message}>
            <input
              type="number"
              step="0.1"
              {...register('service', { valueAsNumber: true })}
              className={fieldClass}
            />
          </Field>
        </div>
        <label className="flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            {...register('serviceEnabled')}
            className="size-4 accent-emerald-700"
          />
          Áp dụng phí dịch vụ
        </label>
        <Field label="Thời điểm hiệu lực" error={errors.effectiveAt?.message}>
          <input
            type="datetime-local"
            {...register('effectiveAt')}
            className={fieldClass}
          />
        </Field>
        <p className="text-sm leading-6 text-slate-500">
          Cấu hình được lưu thành từng phiên bản. Chưa nối với luồng tính tiền
          của thu ngân.
        </p>
        {errors.root && (
          <p role="alert" className="text-rose-600">
            {errors.root.message}
          </p>
        )}
        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button className={primaryButton + ' w-full sm:w-auto'}>
            Lưu cấu hình
          </button>
        </div>
      </form>
    </Panel>
  )
}
