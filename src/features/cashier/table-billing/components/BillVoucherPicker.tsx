import { useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { Modal } from '../../../../components/Modal/Modal'
import { formatCurrency } from '../../../../utils/currency'
import { cashShiftError } from '../../shifts/api/cashShiftApi'
import { getCashierVouchers } from '../api/billApi'

export function BillVoucherPicker({ restaurantId, appliedIds, onSelect, onClose, children }: {
  restaurantId: string
  appliedIds: (string | null)[]
  onSelect: (code: string) => void
  onClose: () => void
  children: ReactNode
}) {
  const userId = useAppSelector((state) => state.auth.session?.user.userId)
  const [page, setPage] = useState(1)
  const vouchers = useQuery({
    queryKey: ['cashier', 'vouchers', userId, restaurantId, page],
    queryFn: ({ signal }) => getCashierVouchers(restaurantId, page, signal),
    retry: false,
    refetchOnMount: 'always',
  })
  const data = vouchers.data

  return (
    <Modal title="Mã ưu đãi" onClose={onClose}>
      <div className="space-y-4 p-5 sm:p-6">
        {children}
        {vouchers.isPending && <p role="status" className="text-sm text-slate-500">Đang tải mã ưu đãi…</p>}
        {vouchers.isError && (
          <div className="space-y-2">
            <p role="alert" className="text-sm text-rose-700">{cashShiftError(vouchers.error)}</p>
            <button type="button" className="btn-secondary" onClick={() => void vouchers.refetch()}>Thử lại</button>
          </div>
        )}
        {data && !vouchers.isError && (
          <>
            {!data.items.length && <p className="text-sm text-slate-500">Chưa có mã ưu đãi đang bật.</p>}
            <ul className="space-y-2">
              {data.items.map((item) => {
                const now = vouchers.dataUpdatedAt
                const status = appliedIds.includes(item.voucherId)
                  ? 'Đã áp dụng'
                  : Date.parse(item.startAt) > now
                    ? 'Chưa bắt đầu'
                    : item.endAt && Date.parse(item.endAt) <= now
                      ? 'Hết hạn'
                      : item.usageLimit != null && item.currentUsage >= item.usageLimit
                        ? 'Hết lượt'
                        : ''
                const discount = item.discountType === 'Percentage'
                  ? `${item.discountValue}%`
                  : formatCurrency(item.discountValue)
                return (
                  <li key={item.voucherId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                    <div className="min-w-0 break-words">
                      <p className="font-semibold text-emerald-800">{item.normalizedVoucherCode}</p>
                      <p className="text-slate-600">Giảm {discount}{item.discountType === 'Percentage' && item.maximumDiscount != null && ` · tối đa ${formatCurrency(item.maximumDiscount)}`}</p>
                      <p className="text-xs text-slate-500">
                        {item.endAt ? `Hạn dùng ${new Date(item.endAt).toLocaleDateString('vi-VN')}` : 'Không giới hạn ngày'}
                      </p>
                    </div>
                    <button type="button" className="btn-secondary shrink-0" disabled={!!status || vouchers.isFetching}
                      onClick={() => onSelect(item.normalizedVoucherCode)}>
                      {status || 'Chọn'}
                    </button>
                  </li>
                )
              })}
            </ul>
            {(page > 1 || data.pageSize < data.totalCount) && (
              <div className="flex items-center justify-between gap-2 text-sm">
                <button type="button" className="btn-secondary" disabled={page === 1 || vouchers.isFetching} onClick={() => setPage(page - 1)}>Trước</button>
                <span>Trang {page}</span>
                <button type="button" className="btn-secondary" disabled={page * data.pageSize >= data.totalCount || vouchers.isFetching} onClick={() => setPage(page + 1)}>Sau</button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
