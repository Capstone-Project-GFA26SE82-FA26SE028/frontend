import { CurrentFees } from '../components/CurrentFees'
import { TaxFeesForm } from '../components/TaxFeesForm'
import { InvoicePreview } from '../components/InvoicePreview'
import { FeeHistoryTable } from '../components/FeeHistoryTable'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feeSchema, type Fees } from '../schema'
import { useTaxFees } from '../hooks/useTaxFees'
import { RestaurantHeading } from '../../components/RestaurantHeading'
import { Notice } from '../../components/AdminUI'
export function TaxFeesPage() {
  const { state, saveFees } = useTaxFees()
  const [notice, setNotice] = useState('')
  const now = new Date()
  const current = [...state.fees]
    .sort((a, b) => Date.parse(b.effectiveAt) - Date.parse(a.effectiveAt))
    .find((f) => Date.parse(f.effectiveAt) <= now.getTime())
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<Fees>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      vat: current?.vat || 0,
      service: current?.service || 0,
      serviceEnabled: current?.serviceEnabled || false,
      effectiveAt: local,
    },
  })
  const draft = useWatch({ control })
  return (
    <>
      <RestaurantHeading
        title="VAT & phí dịch vụ"
        description="Quản lý mức thu và thời điểm áp dụng"
      />
      {notice && <Notice>{notice}</Notice>}
      <CurrentFees current={current} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <TaxFeesForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit((v) => {
            setNotice('')
            const e = saveFees(v)
            if (e) setError('root', { message: e })
            else
              setNotice(
                'Đã lưu cấu hình và thời điểm hiệu lực. Hóa đơn cũ không thay đổi.',
              )
          })}
        />

        <InvoicePreview draft={draft} />
      </div>
      <FeeHistoryTable
        fees={state.fees}
        currentId={current?.id}
        now={now.getTime()}
      />
    </>
  )
}
