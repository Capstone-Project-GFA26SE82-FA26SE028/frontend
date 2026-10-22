import { useState } from 'react'
import { useActivityUser } from '../hooks/useActivity'
import { Modal } from '../../../../components/Modal/Modal'
import { secondaryButton } from '../../components/AdminUI'
import type { ActivityLog } from '../types'
function parseSnapshot(value: string | null): Record<string, unknown> {
  if (value === null) return {}
  try {
    const parsed: unknown = JSON.parse(value)
    return parsed !== null &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : { Value: parsed }
  } catch {
    return { Value: value }
  }
}
function fieldLabel(key: string) {
  const labels: Record<string, string> = {
    roleid: 'Role',
    isactive: 'Status',
    username: 'Username',
    fullname: 'Full name',
    email: 'Email',
    phonenumber: 'Phone',
    avatarurl: 'Avatar URL',
    userid: 'User ID',
    revokedat: 'Revoked at',
    expiresat: 'Expires at',
    createdat: 'Created at',
    updatedat: 'Updated at',
  }
  return (
    labels[key.toLowerCase()] ||
    key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ')
  )
}
function displayValue(key: string, value: unknown) {
  if (value === undefined) return 'Not recorded'
  if (value === null) return 'Not set'
  if (value === '') return 'Empty'
  if (key.toLowerCase() === 'isactive' && typeof value === 'boolean')
    return value ? 'Active' : 'Inactive'
  if (key.toLowerCase() === 'roleid' && typeof value === 'string') {
    const roles: Record<string, string> = {
      admin: 'Administrator',
      manager: 'Manager',
      waiter: 'Waiter',
      cashier: 'Cashier',
      kitchen: 'Kitchen staff',
      inventory: 'Inventory staff',
      supplier: 'Supplier',
    }
    return roles[value.toLowerCase()] || value
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return typeof value === 'object'
    ? JSON.stringify(value, null, 2)
    : String(value)
}
function comparable(value: unknown): string | undefined {
  if (Array.isArray(value)) return JSON.stringify(value.map(comparable))
  if (value !== null && typeof value === 'object')
    return JSON.stringify(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, comparable(item)]),
    )
  return JSON.stringify(value)
}
export function ActivityDetailModal({
  log,
  onClose,
}: {
  log: ActivityLog
  onClose: () => void
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const user = useActivityUser(log.userId)
  const before = parseSnapshot(log.oldValue)
  const after = parseSnapshot(log.newValue)
  const fields = [...new Set([...Object.keys(before), ...Object.keys(after)])]
  return (
    <Modal
      title="Activity details"
      closeLabel="Close"
      onClose={onClose}
      size="wide"
    >
      <div className="space-y-5 p-5 sm:p-6">
        <section className="rounded-xl bg-emerald-50 p-4">
          {!log.userId ? (
            <span className="text-slate-500">Not available</span>
          ) : user.isPending ? (
            <span className="text-slate-500">Loading user...</span>
          ) : user.isError ? (
            <button
              className="text-left text-sm text-rose-600 underline"
              onClick={() => void user.refetch()}
            >
              User unavailable. Retry
            </button>
          ) : !user.data ? (
            <span className="text-slate-500">Unknown user</span>
          ) : (
            <div className="flex items-center gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-semibold text-emerald-800">
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
              <div className="min-w-0">
                <span className="block break-words font-semibold">
                  {user.data.fullName || user.data.userName}
                </span>
                <span className="mt-1 block break-all text-xs text-slate-500">
                  {user.data.email}
                </span>
              </div>
            </div>
          )}
        </section>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ['Action', log.action],
            ['Entity', log.entityName],
            ['User ID', log.userId],
            ['IP address', log.ipAddress],
            ['Created', new Date(log.createdAt).toLocaleString('en-GB')],
            ['Entity ID', log.entityId],
            ['Log ID', log.auditLogId],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-xl border border-slate-200 p-3"
            >
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="mt-1 break-all text-sm font-medium">
                {value ?? 'Not available'}
              </dd>
            </div>
          ))}
        </dl>
        <section>
          <h3 className="mb-3 text-sm font-semibold">Changes</h3>
          {!fields.length ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No before or after values were recorded for this activity.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[440px] table-fixed text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    {['Information', 'Before', 'After'].map((label) => (
                      <th
                        key={label}
                        scope="col"
                        className="px-4 py-3 font-medium"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((key) => {
                    const changed =
                      comparable(before[key]) !== comparable(after[key])
                    return (
                      <tr
                        key={key}
                        className={
                          'border-t border-slate-100 ' +
                          (changed ? 'bg-emerald-50/50' : '')
                        }
                      >
                        <th
                          scope="row"
                          className="break-words px-4 py-3 align-top font-medium text-slate-700"
                        >
                          {fieldLabel(key)}
                          {changed && (
                            <span className="mt-1 block text-xs font-normal text-emerald-700">
                              Changed
                            </span>
                          )}
                        </th>
                        <td className="whitespace-pre-wrap break-all px-4 py-3 align-top text-slate-500">
                          {displayValue(key, before[key])}
                        </td>
                        <td
                          className={
                            'whitespace-pre-wrap break-all px-4 py-3 align-top ' +
                            (changed
                              ? 'font-semibold text-emerald-800'
                              : 'text-slate-700')
                          }
                        >
                          {displayValue(key, after[key])}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button className={secondaryButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
