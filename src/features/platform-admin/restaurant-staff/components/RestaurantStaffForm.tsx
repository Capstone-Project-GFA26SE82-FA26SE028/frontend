import { useState } from 'react'
import { Field } from '../../../../components/Field/Field'
import type { useRestaurantStaff } from '../hooks/useRestaurantStaff'

export function RestaurantStaffForm({
  management: m,
}: {
  management: ReturnType<typeof useRestaurantStaff>
}) {
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')
  return (
    <form
      className="space-y-5 p-6"
      onSubmit={(event) => {
        event.preventDefault()
        if (m.change.isPending || m.list.isFetching || !m.list.isSuccess) return
        const id = userId.trim()
        if (
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            id,
          ) ||
          /^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(id)
        ) {
          setError('Vui lòng nhập ID tài khoản hợp lệ.')
          return
        }
        if (
          m.active.some(
            (row) => row.userIdRef.toLowerCase() === id.toLowerCase(),
          )
        ) {
          setError('Tài khoản này đã được gán vào nhà hàng.')
          return
        }
        setError('')
        m.change.mutate({ userId: id, remove: false })
      }}
    >
      <Field label="ID tài khoản" error={error}>
        <input
          value={userId}
          onChange={(event) => {
            setUserId(event.target.value)
            setError('')
          }}
          disabled={m.change.isPending}
          placeholder="Nhập userIdRef"
          className="min-h-12 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
        />
      </Field>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={m.change.isPending}
          onClick={() => m.setAdding(false)}
          className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm disabled:opacity-40"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={
            m.change.isPending || m.list.isFetching || !m.list.isSuccess
          }
          className="min-h-11 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-40"
        >
          {m.change.isPending ? 'Đang gán…' : 'Gán nhân viên'}
        </button>
      </div>
    </form>
  )
}
