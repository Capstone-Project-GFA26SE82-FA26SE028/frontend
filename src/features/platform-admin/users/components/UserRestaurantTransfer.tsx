import { Field } from '../../../../components/Field/Field'
import { Icon } from '../../../../components/Icon/Icon'
import { useAccountRestaurants } from '../hooks/useUsers'
import type { useStaffTransfer } from '../hooks/useStaffTransfer'
import type { UserAccount } from '../types/types'

export function UserRestaurantTransfer({
  user,
  model,
}: {
  user: UserAccount
  model: ReturnType<typeof useStaffTransfer>
}) {
  const restaurants = useAccountRestaurants(true)
  const sourceId = model.transfer?.sourceRestaurantId || user.restaurantId
  const source = restaurants.data?.find(
    (item) => item.restaurantId === sourceId,
  )
  const targets =
    restaurants.data?.filter((item) => item.restaurantId !== sourceId) || []
  const selected = targets.find(
    (item) => item.restaurantId === model.restaurantId,
  )
  const status = model.transfer?.status
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl bg-mint p-4">
        <span className="rounded-xl bg-white p-3 text-brand">
          <Icon name="store" size={22} />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">
            {status === 'Completed'
              ? 'Nhà hàng trước khi chuyển'
              : 'Nhà hàng hiện tại'}
          </p>
          <p className="mt-1 font-semibold">
            {source?.restaurantName ||
              (restaurants.isPending
                ? 'Đang tải…'
                : 'Chưa lấy được tên nhà hàng')}
          </p>
        </div>
      </div>
      {restaurants.isError ? (
        <p role="alert" className="text-sm text-rose-600">
          Không tải được nhà hàng.{' '}
          <button
            type="button"
            className="underline"
            onClick={() => void restaurants.refetch()}
          >
            Thử lại
          </button>
        </p>
      ) : (
        <Field label="Chuyển đến nhà hàng">
          <select
            className="field"
            value={model.restaurantId}
            disabled={
              model.hasAttempt || model.pending || restaurants.isPending
            }
            onChange={(event) => model.setRestaurantId(event.target.value)}
          >
            <option value="">Chọn nhà hàng mới</option>
            {targets.map((item) => (
              <option key={item.restaurantId} value={item.restaurantId}>
                {item.restaurantName}
              </option>
            ))}
          </select>
        </Field>
      )}
      {!model.hasAttempt && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
          Nhân viên cần bàn giao công việc và đăng nhập lại sau khi chuyển.
        </p>
      )}
      {model.hasAttempt && (
        <div
          role="status"
          className={`rounded-2xl p-4 text-sm leading-6 ${status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}
        >
          <p className="font-semibold">
            {status === 'Completed'
              ? 'Đã chuyển nhà hàng'
              : status === 'Rejected'
                ? 'Không thể chuyển nhà hàng'
                : status === 'Pending'
                  ? 'Đang chuyển nhà hàng…'
                  : 'Đang kiểm tra yêu cầu…'}
          </p>
          <p className="mt-1">
            {model.transfer?.message ||
              (status === 'Completed'
                ? `Đã chuyển đến ${selected?.restaurantName || 'nhà hàng mới'}.`
                : status === 'Rejected'
                  ? 'Nhân viên vẫn thuộc nhà hàng cũ.'
                  : 'Tài khoản tạm thời không thể đăng nhập trong lúc đồng bộ. Bạn có thể đóng cửa sổ và mở lại để kiểm tra.')}
          </p>
        </div>
      )}
      {model.error && (
        <p role="alert" className="text-sm leading-6 text-rose-600">
          {model.error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
        {model.hasAttempt && !model.finished && (
          <button
            type="button"
            disabled={model.pending || model.checking}
            onClick={model.check}
            className="btn-secondary"
          >
            {model.checking ? 'Đang kiểm tra…' : 'Kiểm tra kết quả'}
          </button>
        )}
        {(!model.hasAttempt || model.canRetry) && (
          <button
            type="button"
            disabled={
              model.pending ||
              !selected ||
              restaurants.isError ||
              restaurants.isPending
            }
            onClick={() => void model.submit()}
            className="btn-primary"
          >
            {model.pending
              ? 'Đang gửi…'
              : model.canRetry
                ? 'Gửi lại yêu cầu'
                : 'Xác nhận chuyển'}
          </button>
        )}
      </div>
    </div>
  )
}
