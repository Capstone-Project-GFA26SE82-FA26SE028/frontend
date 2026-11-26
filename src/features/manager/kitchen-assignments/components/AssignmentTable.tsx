import { buttonClass } from '../constants/assignment'
import { employeeName } from '../utils/assignment'
import type { AssignmentRow } from '../types/assignment'

export function AssignmentTable({
  rows,
  disabled,
  onEdit,
  onRemove,
}: {
  rows: AssignmentRow[]
  disabled: boolean
  onEdit: (row: AssignmentRow) => void
  onRemove: (row: AssignmentRow) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-4">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th>Trạm bếp</th>
            <th>Trạng thái trạm</th>
            <th>Người phụ trách</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.kitchenStationId}
              className="border-t border-slate-100"
            >
              <td>
                <strong>{row.kitchenStationName}</strong>
                <p className="mt-1 text-xs text-slate-500">
                  {row.kitchenStationCode}
                </p>
              </td>
              <td>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${row.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                >
                  {row.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </td>
              <td>
                {row.assignment ? (
                  <>
                    <p className="font-medium">
                      {employeeName(row.assignment.employee)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {row.assignment.employee?.email}
                    </p>
                    {(!row.assignment.employee?.isActive ||
                      row.assignment.employee.roleId !== 'kitchen') && (
                      <p className="mt-1 text-xs text-amber-800">
                        Cần kiểm tra lại nhân viên phụ trách
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-amber-800">Chưa phân công</span>
                )}
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={buttonClass}
                    disabled={disabled || !row.isActive}
                    onClick={() => onEdit(row)}
                  >
                    {row.assignment ? 'Đổi người' : 'Phân công'}
                  </button>
                  {row.assignment && (
                    <button
                      type="button"
                      className={buttonClass}
                      disabled={disabled}
                      onClick={() => onRemove(row)}
                    >
                      Gỡ phân công
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
