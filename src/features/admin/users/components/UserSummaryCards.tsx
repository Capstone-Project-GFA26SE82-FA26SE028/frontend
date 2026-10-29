import { SummaryCards } from '../../components/AdminUI'

export function UserSummaryCards({
  totals,
  adminCount,
  hasError,
  onRetry,
}: {
  totals?: { all: number; active: number; locked: number }
  adminCount?: number
  hasError: boolean
  onRetry: () => void
}) {
  return (
    <>
      <SummaryCards
        items={[
          {
            label: 'Tổng người dùng',
            value: totals?.all ?? '—',
            icon: 'users',
            note: 'Tất cả tài khoản',
          },
          {
            label: 'Tài khoản hoạt động',
            value: totals?.active ?? '—',
            icon: 'check',
            note: 'Tài khoản đang được kích hoạt',
          },
          {
            label: 'Tài khoản vô hiệu hóa',
            value: totals?.locked ?? '—',
            icon: 'shield',
            note: 'Lịch sử tài khoản được giữ lại',
          },
          {
            label: 'Quản trị viên',
            value: adminCount ?? '—',
            icon: 'settings',
            note: 'Quản trị viên đang hoạt động',
          },
        ]}
      />
      {hasError && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"
        >
          Không thể tải thống kê tài khoản.{' '}
          <button className="underline" onClick={onRetry}>
            Thử lại
          </button>
        </div>
      )}
    </>
  )
}
