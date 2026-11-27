import { Link } from 'react-router-dom'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { useCashShift } from '../../shifts/hooks/useCashShift'
import { useTableBilling } from '../hooks/useTableBilling'
import { BillingTableList } from '../components/BillingTableList'
import { BillingDetails } from '../components/BillingDetails'
import { usePrepareBill } from '../hooks/usePrepareBill'
import { entryKey } from '../utils/billingDisplay'
import { BillingToolbar } from '../components/BillingToolbar'
import { usePayOsPaymentStatus } from '../hooks/usePayOsPaymentStatus'

export function TableBillingPage() {
  const { user, restaurantId, workspace } = useCashShift()
  const shift = workspace.data?.shift
  if (restaurantId && workspace.isPending)
    return <p role="status">Đang kiểm tra ca…</p>
  if (workspace.isError) {
    return (
      <div className="space-y-3">
        <p role="alert">{cashShiftError(workspace.error)}</p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => void workspace.refetch()}
        >
          Thử lại
        </button>
      </div>
    )
  }
  if (
    !restaurantId ||
    shift?.status !== 'Active' ||
    shift.cashierUserRef.toLowerCase() !== user.userId.toLowerCase()
  ) {
    return (
      <section className="space-y-4 rounded-2xl bg-white p-6">
        <h1 className="text-xl font-semibold">Bàn & hóa đơn</h1>
        <p>Cần có ca đang mở của bạn để xem hóa đơn tại quầy.</p>
        <Link to="/cashier" className="btn-primary">
          Về ca làm việc
        </Link>
      </section>
    )
  }
  return (
    <BillingDesk
      key={shift.cashShiftId}
      restaurantId={restaurantId}
      cashShiftId={shift.cashShiftId}
      cashRegisterId={shift.cashRegisterId}
      openedAt={shift.openedAt}
    />
  )
}

function BillingDesk({
  restaurantId,
  cashShiftId,
  cashRegisterId,
  openedAt,
}: {
  restaurantId: string
  cashShiftId: string
  cashRegisterId: string
  openedAt: string
}) {
  const model = useTableBilling(restaurantId, cashShiftId)
  const watchPayment = usePayOsPaymentStatus(restaurantId, cashShiftId)
  const prepare = usePrepareBill(restaurantId, cashShiftId, (entry, billId) => {
    model.setSelectedKey((current) =>
      current === entryKey(entry) ? billId : current,
    )
  })
  const searchInput = useRef<HTMLInputElement>(null)

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 self-stretch">
      <BillingToolbar
        openedAt={openedAt}
        searchInput={searchInput}
        refreshing={model.list.isFetching || model.areas.isFetching}
        onRefresh={() => {
          void model.list.refetch()
          void model.areas.refetch()
        }}
      />
      <div className="grid flex-1 content-start gap-3 lg:content-stretch lg:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_480px]">
        <BillingTableList model={model} searchInput={searchInput} />
        <BillingDetails
          selected={model.selected}
          tab={model.tab}
          prepare={prepare}
          cashShiftId={cashShiftId}
          cashRegisterId={cashRegisterId}
          restaurantId={restaurantId}
          onWatchPayOsPayment={watchPayment}
          onPaid={(billId) =>
            model.setSelectedKey((current) => current === billId ? null : current)
          }
        />
      </div>
    </div>
  )
}
import { useRef } from 'react'
