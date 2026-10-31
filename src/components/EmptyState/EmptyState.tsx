import type { ReactNode } from 'react'
import { Icon } from '../Icon/Icon'

type EmptyStateProps = {
  title?: string
  description?: string
  action?: ReactNode
}

// Thông báo danh sách trống; trang sử dụng quyết định khi nào hiển thị.
export function EmptyState({
  title = 'Không tìm thấy kết quả',
  description = 'Thử thay đổi từ khóa hoặc bộ lọc.',
  action,
}: EmptyStateProps) {
  return (
    <section className="px-5 py-14 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Icon name="search" size={24} />
      </span>
      <h3 className="mt-4 font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </section>
  )
}
