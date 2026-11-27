import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Modal } from '../../../../components/Modal/Modal'
import {
  approveRegistration,
  getRegistration,
  registrationError,
} from '../api/registrationApi'
import { RegistrationDocument } from './RegistrationDocument'
import { registrationDate, statusLabels } from '../format'

export function RegistrationDetail({
  id,
  onClose,
}: {
  id: string
  onClose: () => void
}) {
  const [confirmed, setConfirmed] = useState(false)
  const client = useQueryClient()
  const detail = useQuery({
    queryKey: ['restaurant-registrations', 'detail', id],
    queryFn: ({ signal }) => getRegistration(id, signal),
  })
  const approve = useMutation({
    mutationFn: () => approveRegistration(id),
    retry: false,
    onSuccess: (receipt) => {
      toast.success(
        receipt.status === 'Approved'
          ? 'Đã duyệt hồ sơ và cấp quyền admin nhà hàng.'
          : 'Hồ sơ đang được cấp quyền.',
      )
      setConfirmed(false)
    },
    onSettled: () => {
      void client.invalidateQueries({ queryKey: ['restaurant-registrations'] })
      void client.invalidateQueries({ queryKey: ['restaurants'] })
      void client.invalidateQueries({ queryKey: ['users'] })
      void client.invalidateQueries({ queryKey: ['sessions'] })
      void client.invalidateQueries({ queryKey: ['audit-logs'] })
    },
  })
  const item = detail.data
  return (
    <Modal
      title="Chi tiết hồ sơ nhà hàng"
      size="wide"
      closeLabel="Đóng"
      onClose={() => {
        if (!approve.isPending) onClose()
      }}
    >
      <div className="space-y-6 p-5 sm:p-6">
        {detail.isPending ? (
          <p role="status">Đang tải hồ sơ…</p>
        ) : detail.isError ? (
          <div className="space-y-3">
            <p role="alert" className="text-rose-700">
              {registrationError(detail.error)}
            </p>
            <button
              className="btn-secondary"
              onClick={() => void detail.refetch()}
            >
              Thử lại
            </button>
          </div>
        ) : (
          item && (
            <>
              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                  {statusLabels[item.status]}
                </span>
                <h3 className="mt-4 text-xl font-bold">
                  {item.restaurant.restaurantName}
                </h3>
                <p className="mt-1 break-all text-xs text-slate-500">
                  Mã hồ sơ: {item.registrationId}
                </p>
              </div>
              <dl className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                {[
                  ['Email người đăng ký', item.email],
                  ['Mã người đăng ký', item.applicantUserId],
                  [
                    'Ngày nộp (giờ Việt Nam)',
                    registrationDate(item.submittedAt),
                  ],
                  [
                    'Ngày duyệt (giờ Việt Nam)',
                    registrationDate(item.reviewedAt),
                  ],
                  ['Người duyệt', item.reviewedBy],
                  ['Mã nhà hàng', item.restaurantId],
                  ['Địa chỉ', item.restaurant.address],
                  ['Hotline', item.restaurant.hotline],
                  ['Mã số thuế', item.restaurant.taxCode],
                  ['Múi giờ', item.restaurant.timeZone],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="mt-1 break-words font-medium">
                      {value || 'Chưa có'}
                    </dd>
                  </div>
                ))}
              </dl>
              <section>
                <h3 className="mb-3 font-semibold">Giờ hoạt động</h3>
                <dl className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                    const hours = item.restaurant.openingHours.find(
                      (hour) => hour.dayOfWeek === day,
                    )
                    return (
                      <div
                        key={day}
                        className="flex justify-between gap-3 py-2 text-sm"
                      >
                        <dt>{day === 0 ? 'Chủ nhật' : `Thứ ${day + 1}`}</dt>
                        <dd>
                          {hours
                            ? `${hours.openAt} – ${hours.closeAt}`
                            : 'Chưa thiết lập'}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </section>
              <div className="grid gap-4 sm:grid-cols-2">
                <RegistrationDocument
                  id={id}
                  kind="business"
                  title="Giấy đăng ký kinh doanh"
                />
                <RegistrationDocument
                  id={id}
                  kind="food-safety"
                  title="Giấy chứng nhận an toàn thực phẩm"
                />
              </div>
              {item.status !== 'Approved' ? (
                <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm leading-6">
                    {item.status === 'Provisioning'
                      ? 'Nhà hàng đã được tạo và đang cấp quyền cho người đăng ký. Có thể tiếp tục xử lý nếu lần duyệt trước bị gián đoạn.'
                      : 'Duyệt hồ sơ sẽ tạo nhà hàng và cấp quyền admin cho người đăng ký. Các phiên đăng nhập hiện tại của tài khoản này sẽ bị thu hồi.'}
                  </p>
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 shrink-0"
                      checked={confirmed}
                      disabled={approve.isPending}
                      onChange={(event) => setConfirmed(event.target.checked)}
                    />
                    Tôi đã kiểm tra thông tin và giấy tờ, đồng ý cấp quyền admin
                    nhà hàng.
                  </label>
                  <button
                    className="btn-primary min-h-11 w-full"
                    disabled={
                      !confirmed || approve.isPending || detail.isFetching
                    }
                    onClick={() => approve.mutate()}
                  >
                    {approve.isPending
                      ? 'Đang xử lý…'
                      : item.status === 'Provisioning'
                        ? 'Tiếp tục cấp quyền'
                        : 'Duyệt hồ sơ'}
                  </button>
                </div>
              ) : (
                <p
                  role="status"
                  className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                  Hồ sơ đã được duyệt. Nhà hàng và tài khoản admin đã được kích
                  hoạt.
                </p>
              )}
              {approve.isError && (
                <p
                  role="alert"
                  className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
                >
                  {registrationError(approve.error)}
                </p>
              )}
            </>
          )
        )}
        <button
          className="btn-secondary min-h-11 w-full"
          disabled={approve.isPending}
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </Modal>
  )
}
