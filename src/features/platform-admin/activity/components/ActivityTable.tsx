import { Icon } from '../../../../components/Icon/Icon'
import { useState } from 'react'
import type { ActivityLog } from '../types/types'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'
export function ActivityTable({
  items,
  onDetail,
  onUser,
}: {
  items: ActivityLog[]
  onDetail: (item: ActivityLog) => void
  onUser: (id: string) => void
}) {
  const [failedAvatars, setFailedAvatars] = useState<string[]>([])
  if (!items.length)
    return (
      <EmptyState
        title="Không tìm thấy hoạt động"
        description="Thử thay đổi bộ lọc hoặc kiểm tra lại sau."
      />
    )
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] table-fixed text-left text-sm">
        <caption className="sr-only">Nhật ký hoạt động, mới nhất trước</caption>
        <thead className="border-y border-slate-100 bg-slate-50 text-slate-600">
          <tr>
            {[
              'Thời gian',
              'Người thực hiện',
              'Thao tác',
              'Đối tượng',
              'Chi tiết',
            ].map((label) => (
              <th scope="col" key={label} className="px-4 py-3.5 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.auditLogId}
              className="border-b border-slate-100 align-middle last:border-b-0 hover:bg-slate-50/60"
            >
              <td className="p-4 text-slate-600">
                <time dateTime={item.createdAt}>
                  {new Date(item.createdAt).toLocaleString('en-GB')}
                </time>
              </td>
              <td className="p-4">
                {item.userId ? (
                  <button
                    type="button"
                    className="flex items-center gap-3 text-left hover:text-emerald-700"
                    title="Lọc theo người dùng này"
                    onClick={() => onUser(item.userId!)}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-700">
                      {item.avatarUrl &&
                      /^https?:\/\//i.test(item.avatarUrl) &&
                      !failedAvatars.includes(item.avatarUrl) ? (
                        <img
                          src={item.avatarUrl}
                          alt=""
                          className="size-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedAvatars((previous) => [
                              ...previous,
                              item.avatarUrl!,
                            ])
                          }
                        />
                      ) : (
                        <Icon name="users" size={19} />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block break-words font-semibold">
                        {item.fullName || item.userName || item.userId}
                      </span>
                      {item.email && (
                        <span className="mt-1 block break-all text-xs text-slate-500">
                          {item.email}
                        </span>
                      )}
                    </span>
                  </button>
                ) : (
                  <span className="text-slate-500">Chưa có dữ liệu</span>
                )}
              </td>
              <td className="break-words p-4">
                <span className="inline-block max-w-full rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  {item.action || 'Chưa có dữ liệu'}
                </span>
              </td>
              <td className="break-words p-4 text-slate-700">
                {item.entityName || 'Chưa có dữ liệu'}
              </td>
              <td className="p-4">
                <button
                  className="flex size-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
                  title="Xem chi tiết"
                  aria-label="Xem chi tiết nhật ký hoạt động"
                  aria-haspopup="dialog"
                  onClick={() => onDetail(item)}
                >
                  <Icon name="eye" size={19} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
