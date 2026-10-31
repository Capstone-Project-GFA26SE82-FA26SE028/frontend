import { CurrentFees } from '../components/CurrentFees'
import { TaxFeesForm } from '../components/TaxFeesForm'
import { FeeHistoryTable } from '../components/FeeHistoryTable'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feeSchema, type Fees } from '../schemas/taxFeeSchema'
import { useTaxFees } from '../hooks/useTaxFees'
import { PageHeading, Notice, secondaryButton } from '../../components/AdminUI'
import { taxFeeError } from '../api/taxFeeApi'
export function TaxFeesPage() {
  const { list, current, fees, now, save } = useTaxFees()
  const [notice, setNotice] = useState('')
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
    if (!list.isSuccess || initialized.current) return
    initialized.current = true
    reset({
      vat: current?.vat ?? 0,
      service: current?.service ?? 0,
      serviceEnabled: current?.serviceEnabled ?? false,
      applyAt: 'now',
      effectiveAt: '',
    })
  }, [list.isSuccess, current, reset])
  const applyAt = useWatch({ control, name: 'applyAt' })
  return (
    <>
      <PageHeading
        title="VAT & phí dịch vụ"
        description="Áp dụng chung cho tất cả nhà hàng."
        action={
          <button
            type="button"
            className={secondaryButton}
            disabled={list.isFetching}
            onClick={() => void list.refetch()}
          >
            {list.isFetching ? 'Đang tải…' : 'Tải lại'}
          </button>
        }
      />
      {notice && <Notice>{notice}</Notice>}
      {list.isError && (
        <div
          role="alert"
          className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {taxFeeError(list.error)}
        </div>
      )}
      {list.isPending ? (
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
          disabled={list.isPending || list.isError}
          onSubmit={handleSubmit(async (values) => {
            if (save.isPending) return
            setNotice('')
            try {
              await save.mutateAsync(values)
              setNotice('Đã lưu cấu hình VAT và phí dịch vụ.')
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
      <FeeHistoryTable fees={fees} currentId={current?.id} now={now} />
    </>
  )
}
