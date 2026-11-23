import { useState } from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { PaymentRequestOption } from '../../payment-requests/components/PaymentRequestOption'
import { sessionError } from '../../table-session/api/tableSessionApi'
import { useStaffCall } from '../hooks/useStaffCall'

export function ServiceRequestButton() {
  const table = useAppSelector((state) => state.customerSession.table)
  if (!table) return null
  return (
    <StaffCallButton
      key={table.tableSessionId}
      sessionId={table.tableSessionId}
      tableCode={table.tableCode}
    />
  )
}

function StaffCallButton({
  sessionId,
  tableCode,
}: {
  sessionId: string
  tableCode: string
}) {
  const [open, setOpen] = useState(false)
  const { call, send } = useStaffCall(sessionId, open)
  const status = call.data?.status
  const awaitingStaff = status === 'Requested' || status === 'Acknowledged'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary min-h-11 gap-2 whitespace-nowrap px-3 text-xs sm:px-4 sm:text-sm"
      >
        <Icon name="service" size={18} className="hidden sm:block" />
        Gọi phục vụ
      </button>
      {open && (
        <Modal title="Gọi phục vụ" onClose={() => setOpen(false)}>
          <div className="space-y-4 p-6">
            <p className="text-sm font-semibold">Bàn {tableCode}</p>
            {call.isPending ? (
              <p role="status" className="text-sm text-muted">
                Đang kiểm tra yêu cầu…
              </p>
            ) : call.isError ? (
              <div className="space-y-3">
                <p role="alert" className="text-sm text-rose-700">
                  {sessionError(call.error)}
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => void call.refetch()}
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <>
                <p
                  role={status ? 'status' : undefined}
                  className="rounded-xl bg-mint p-4 text-sm text-brand"
                >
                  {status === 'Requested'
                    ? 'Đã gọi phục vụ. Bạn chờ một chút nhé!'
                    : status === 'Acknowledged'
                      ? 'Phục vụ đã tiếp nhận yêu cầu.'
                      : status === 'Completed'
                        ? 'Yêu cầu đã được hỗ trợ.'
                        : 'Gửi yêu cầu để nhân viên đến hỗ trợ bàn của bạn.'}
                </p>
                {send.isError && !awaitingStaff && (
                  <p role="alert" className="text-sm text-rose-700">
                    {sessionError(send.error)}
                  </p>
                )}
                {!awaitingStaff && (
                  <button
                    type="button"
                    className="btn-primary w-full"
                    disabled={send.isPending || call.isFetching}
                    onClick={() => send.mutate()}
                  >
                    {send.isPending ? 'Đang gửi…' : 'Gọi nhân viên'}
                  </button>
                )}
              </>
            )}
            <PaymentRequestOption sessionId={sessionId} />
          </div>
        </Modal>
      )}
    </>
  )
}
