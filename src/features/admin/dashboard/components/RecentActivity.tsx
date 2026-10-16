import { auditPresentation } from '../../activity/auditPresentation'
import type { AuditEntry } from '../../activity/types'
import { dateTime } from '../../utils'
import { DashboardSection } from './DashboardSection'
export function RecentActivity({ items }: { items: AuditEntry[] }) {
  return (
    <DashboardSection
      title="Hoạt động gần đây"
      icon="clock"
      href="/admin/activity"
    >
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              {[
                'Thời gian',
                'Người thực hiện',
                'Hành động',
                'Đối tượng',
                'Chi tiết',
              ].map((text) => (
                <th key={text} className="px-4 py-2 font-medium">
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const display = auditPresentation(item)
              return (
                <tr key={item.id} className="hover:bg-emerald-50/30">
                  <td className="whitespace-nowrap px-4 py-2 text-slate-500">
                    {dateTime(item.time)}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{display.actor}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        'inline-block whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ' +
                        display.tone
                      }
                    >
                      {display.label}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-700">{item.target}</td>
                  <td className="max-w-80 px-4 py-2 text-slate-500">
                    <span className="line-clamp-2 break-words">
                      {display.detail}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!items.length && (
          <div className="px-4 py-9 text-center text-sm text-slate-500">
            Chưa có hoạt động. Các thay đổi tài khoản và cấu hình sẽ hiển thị
            tại đây.
          </div>
        )}
      </div>
    </DashboardSection>
  )
}
