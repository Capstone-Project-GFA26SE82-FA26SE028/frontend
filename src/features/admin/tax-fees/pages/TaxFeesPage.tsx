import { Icon } from '../../../../components/Icon/Icon'
import { CurrentFees } from '../components/CurrentFees'
import { TaxFeesForm } from '../components/TaxFeesForm'
import { FeeHistoryTable } from '../components/FeeHistoryTable'
import { useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feeSchema, type Fees } from '../schemas/taxFeeSchema'
import { useTaxFees } from '../hooks/useTaxFees'

import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { taxFeeError } from '../api/taxFeeApi'
export function TaxFeesPage() {
  const {
    list,
    effective,
    current,
    fees,
    now,
    save,
    page,
    setPage,
    total,
    refresh,
  } = useTaxFees()
  const initialized = useRef(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Fees>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      vat: current?.vat || 0,
      service: current?.service || 0,
      serviceEnabled: current?.serviceEnabled || false,
      applyAt: 'now',
      effectiveAt: '',
    },
  })
  useEffect(() => {
    if (!effective.isSuccess || initialized.current) return
    initialized.current = true
    reset({
      vat: current?.vat ?? 0,
      service: current?.service ?? 0,
      serviceEnabled: current?.serviceEnabled ?? false,
      applyAt: 'now',
      effectiveAt: '',
    })
  }, [effective.isSuccess, current, reset])
  const applyAt = useWatch({ control, name: 'applyAt' })
  return (
    <>
      <PageHeading
        title="VAT & phí dịch vụ"
        description="Áp dụng chung cho tất cả nhà hàng."
        action={
          <button
            type="button"
            disabled={list.isFetching || effective.isFetching}
            onClick={() => void refresh()}
            title="Tải lại"
            aria-label="Tải lại"
            aria-busy={list.isFetching || effective.isFetching}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40"
          >
            <Icon
              name="refresh"
              size={18}
              className={
                list.isFetching || effective.isFetching
                  ? 'animate-spin motion-reduce:animate-none'
                  : ''
              }
            />
          </button>
        }
      />
      {effective.isError && (
        <div
          role="alert"
          className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {taxFeeError(effective.error)}
        </div>
      )}
      {effective.isPending ? (
        <p role="status" className="py-8 text-center text-slate-500">
          Đang tải cấu hình…
        </p>
      ) : (
        <CurrentFees current={current} />
      )}
      <div>
        <TaxFeesForm
          register={register}
          errors={errors}
          applyAt={applyAt || 'now'}
          busy={save.isPending}
          disabled={effective.isPending || effective.isError}
          onSubmit={handleSubmit(async (values) => {
            if (save.isPending) return
            try {
              await save.mutateAsync(values)
            } catch {
              /* The API error is displayed below the form. */
            }
          })}
        />
      </div>
      {save.isError && (
        <div
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {taxFeeError(save.error)}
        </div>
      )}
      {list.isError && (
        <div
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {taxFeeError(list.error)}
        </div>
      )}
      <FeeHistoryTable
        fees={fees}
        currentId={current?.id}
        now={now}
        page={page}
        total={total}
        onPage={setPage}
        busy={list.isFetching}
        currentReady={effective.isSuccess}
      />
    </>
  )
}
