import type { LoginSession } from '../types'
import { roleLabels } from '../../users/types'
import { Badge, EmptyState } from '../../components/AdminUI'
import { dateTime } from '../../utils'
export function SessionTable({ sessions }: { sessions: LoginSession[] }) {
  return (
    <>
      {' '}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                'Tài khoản',
                'Vai trò',
                'Thiết bị / IP',
                'Đăng nhập lúc',
                'Trạng thái',
              ].map((h) => (
                <th className="p-4 font-medium" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="p-4">
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-slate-400">{s.email}</p>
                </td>
                <td className="p-4">{roleLabels[s.role]}</td>
                <td className="p-4">
                  {s.device}
                  <p className="mt-1 text-slate-400">{s.ip}</p>
                </td>
                <td className="p-4">{dateTime(s.time)}</td>
                <td className="p-4">
                  <Badge tone={s.active ? 'green' : 'slate'}>
                    {s.active ? 'Đang hoạt động' : 'Đã kết thúc'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!sessions.length && <EmptyState />}
    </>
  )
}
