import { useState } from 'react'
import { buttonClass, inputClass, primaryClass } from '../constants/assignment'
import { employeeName } from '../utils/assignment'
import type { AssignmentRow, KitchenEmployee } from '../types/assignment'

export function AssignmentForm({
  row,
  employees,
  pending,
  error,
  onSave,
  onClose,
}: {
  row: AssignmentRow
  employees: KitchenEmployee[]
  pending: boolean
  error?: string
  onSave: (userId: string) => void
  onClose: () => void
}) {
  const [userId, setUserId] = useState('')
  const choices = employees.filter(
    (employee) => employee.userId !== row.assignment?.userId,
  )
  return (
    <form
      className="space-y-4 p-6"
      onSubmit={(event) => {
        event.preventDefault()
        if (!pending && choices.some((e) => e.userId === userId)) onSave(userId)
      }}
    >
      <p className="text-sm text-slate-600">
        Trạm <strong>{row.kitchenStationName}</strong> ({row.kitchenStationCode}
        )
      </p>
      {row.assignment && (
        <p className="text-sm">
          Đang phụ trách: {employeeName(row.assignment.employee)}
        </p>
      )}
      <label className="block space-y-2 text-sm font-medium">
        <span>Nhân viên bếp *</span>
        <select
          required
          aria-label="Nhân viên bếp"
          className={inputClass}
          value={userId}
          disabled={pending}
          onChange={(event) => setUserId(event.target.value)}
        >
          <option value="">Chọn nhân viên</option>
          {choices.map((employee) => (
            <option key={employee.userId} value={employee.userId}>
              {employeeName(employee)} · {employee.email}
            </option>
          ))}
        </select>
      </label>
      {!choices.length && (
        <p role="status" className="text-sm text-amber-800">
          Chưa có nhân viên bếp phù hợp. Nhân viên cần đang hoạt động và thuộc
          nhà hàng này.
        </p>
      )}
      <p className="text-sm text-slate-500">
        Mỗi trạm có một người phụ trách. Không thể đổi người khi trạm còn món
        đang chế biến.
      </p>
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className={buttonClass}
          disabled={pending}
          onClick={onClose}
        >
          Đóng
        </button>
        <button
          className={primaryClass}
          disabled={pending || !choices.some((e) => e.userId === userId)}
        >
          {pending
            ? 'Đang lưu…'
            : row.assignment
              ? 'Đổi người phụ trách'
              : 'Phân công'}
        </button>
      </div>
    </form>
  )
}
