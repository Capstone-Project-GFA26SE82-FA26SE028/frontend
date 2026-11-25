import type { ReactNode } from 'react'

import { catalogError } from '../api/catalogApi'

export function QueryState({
  pending,
  error,
  retry,
  children,
  empty,
}: {
  pending: boolean
  error: unknown
  retry: () => void
  children: ReactNode
  empty?: boolean
}) {
  if (pending)
    return (
      <p role="status" className="p-12 text-center text-slate-500">
        Đang tải…
      </p>
    )
  if (error)
    return (
      <div role="alert" className="space-y-4 p-8 text-center">
        <p className="text-sm text-rose-700">{catalogError(error)}</p>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          onClick={retry}
        >
          Thử lại
        </button>
      </div>
    )
  if (empty)
    return (
      <div className="px-5 py-14 text-center">
        <h2 className="font-semibold">Không tìm thấy kết quả</h2>
        <p className="mt-2 text-sm text-slate-500">
          Thêm bản ghi mới hoặc đổi bộ lọc để xem kết quả.
        </p>
      </div>
    )
  return children
}
