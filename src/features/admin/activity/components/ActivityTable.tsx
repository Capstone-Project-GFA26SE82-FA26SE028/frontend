import { Icon } from '../../../../components/Icon/Icon'
import { useState } from 'react'
import { useActivityUser } from '../hooks/useActivity'
import type { ActivityLog } from '../types'
import { EmptyState } from '../../components/AdminUI'
export function ActivityTable({
  items,
  onDetail,
  onUser,
}: {
  items: ActivityLog[]
  onDetail: (item: ActivityLog) => void
  onUser: (id: string) => void
}) {
  if (!items.length)
    return (
      <EmptyState
        title="No activity found"
        description="Try clearing the user filter or check again later."
      />
    )
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] table-fixed text-left text-sm">
        <caption className="sr-only">Activity logs, newest first</caption>
        <thead className="border-y border-slate-100 bg-slate-50 text-slate-600">
          <tr>
            {['Time', 'User', 'Action', 'Entity', 'Details'].map((label) => (
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
                <ActivityUserName id={item.userId} onSelect={onUser} />
              </td>
              <td className="break-words p-4">
                <span className="inline-block max-w-full rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  {item.action || 'Not available'}
                </span>
              </td>
              <td className="break-words p-4 text-slate-700">
                {item.entityName || 'Not available'}
              </td>
              <td className="p-4">
                <button
                  className="flex size-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
                  title="View details"
                  aria-label="View audit log details"
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

function ActivityUserName({
  id,
  onSelect,
}: {
  id: string | null
  onSelect?: (id: string) => void
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const user = useActivityUser(id)
  if (!id) return <span className="text-slate-500">Not available</span>
  if (user.isPending)
    return <span className="text-slate-500">Loading user...</span>
  if (user.isError)
    return (
      <button
        className="text-left text-sm text-rose-600 underline"
        onClick={() => void user.refetch()}
      >
        User unavailable. Retry
      </button>
    )
  if (!user.data) return <span className="text-slate-500">Unknown user</span>
  const content = (
    <span className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-semibold text-emerald-800">
        {user.data.avatarUrl &&
        /^https?:\/\//i.test(user.data.avatarUrl) &&
        failedUrl !== user.data.avatarUrl ? (
          <img
            src={user.data.avatarUrl}
            alt={(user.data.fullName || user.data.userName) + ' avatar'}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={() => setFailedUrl(user.data!.avatarUrl)}
          />
        ) : (
          (user.data.fullName || user.data.userName)
            .trim()
            .charAt(0)
            .toUpperCase() || '?'
        )}
      </span>
      <span className="min-w-0">
        <span className="block break-words font-semibold">
          {user.data.fullName || user.data.userName}
        </span>
        <span className="mt-1 block break-all text-xs text-slate-500">
          {user.data.email}
        </span>
      </span>
    </span>
  )
  return onSelect ? (
    <button
      className="text-left hover:text-emerald-700"
      title="Filter by this user"
      onClick={() => onSelect(id)}
    >
      {content}
    </button>
  ) : (
    <div>{content}</div>
  )
}
