import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { Badge } from '../../../../components/Badge/Badge'
import { restaurantStaffError } from '../api/restaurantStaffApi'
import { useRestaurantStaff } from '../hooks/useRestaurantStaff'
import { RestaurantStaffForm } from './RestaurantStaffForm'

export function RestaurantStaffSection({
  restaurantId,
}: {
  restaurantId: string
}) {
  const m = useRestaurantStaff(restaurantId)
  const [search, setSearch] = useState('')
  const rows = m.active.filter((row) =>
    row.userIdRef.toLowerCase().includes(search.trim().toLowerCase()),
  )
  // TODO backend: trả thêm thông tin tài khoản trong API staff để hiển thị tên, email, ảnh và vai trò.
  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-200/20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon name="users" size={21} />
            </span>
            <h2 className="font-semibold text-slate-800">
              Nhân viên đã phân công{' '}
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {m.list.isSuccess ? m.active.length : '—'}
              </span>
            </h2>
          </div>
          <button
            type="button"
            disabled={m.change.isPending || !m.list.isSuccess}
            onClick={() => m.setAdding(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-40"
          >
            <Icon name="plus" size={18} />
            Thêm nhân viên
          </button>
        </div>
        {m.list.isPending ? (
          <p role="status" className="p-10 text-center text-sm text-slate-500">
            Đang tải nhân viên…
          </p>
        ) : m.list.isError ? (
          <div
            role="alert"
            className="space-y-3 p-8 text-center text-sm text-rose-600"
          >
            <p>{restaurantStaffError(m.list.error)}</p>
            <button
              type="button"
              onClick={() => void m.list.refetch()}
              className="rounded-lg border border-rose-100 px-4 py-2"
            >
              Thử lại
            </button>
          </div>
        ) : !m.active.length ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <span className="mb-4 rounded-2xl bg-emerald-50 p-4 text-emerald-600">
              <Icon name="users" size={30} />
            </span>
            <h3 className="font-semibold text-slate-800">Chưa có nhân viên</h3>
            <button
              type="button"
              onClick={() => m.setAdding(true)}
              className="mt-4 text-sm font-semibold text-emerald-700 hover:underline"
            >
              + Thêm nhân viên đầu tiên
            </button>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 sm:px-6">
              <label className="relative block sm:max-w-sm">
                <span className="sr-only">Tìm ID tài khoản đã phân công</span>
                <Icon
                  name="search"
                  size={18}
                  className="pointer-events-none absolute left-3 top-3 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm theo ID tài khoản…"
                  className="min-h-11 w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-emerald-500"
                />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      ID tài khoản
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Phân công
                    </th>
                    <th scope="col" className="px-5 py-3">
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {!rows.length && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-slate-500"
                      >
                        Không tìm thấy ID phù hợp.
                      </td>
                    </tr>
                  )}
                  {rows.map((row) => (
                    <tr key={row.userIdRef} className="hover:bg-slate-50/60">
                      <td className="break-all px-5 py-4 font-mono text-xs text-slate-700">
                        {row.userIdRef}
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone="green">Đã gán</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          title="Gỡ khỏi nhà hàng"
                          aria-label={'Gỡ tài khoản ' + row.userIdRef}
                          disabled={m.change.isPending || m.list.isFetching}
                          onClick={() => m.setRemoving(row.userIdRef)}
                          className="inline-flex size-10 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                        >
                          <Icon name="trash" size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              {rows.length} trên {m.active.length} nhân viên
            </div>
          </>
        )}
      </section>
      {m.adding && (
        <Modal
          title="Thêm nhân viên"
          onClose={() => {
            if (!m.change.isPending) m.setAdding(false)
          }}
        >
          <RestaurantStaffForm management={m} />
        </Modal>
      )}
      {m.removing && (
        <Modal
          title="Gỡ nhân viên"
          onClose={() => {
            if (!m.change.isPending) m.setRemoving(null)
          }}
        >
          <div className="p-6">
            <p className="text-sm text-slate-600">
              Gỡ tài khoản này khỏi nhà hàng?
            </p>
            <p className="mt-3 break-all rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-700">
              {m.removing}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={m.change.isPending}
                onClick={() => m.setRemoving(null)}
                className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm disabled:opacity-40"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={m.change.isPending || m.list.isFetching}
                onClick={() =>
                  m.change.mutate({ userId: m.removing!, remove: true })
                }
                className="min-h-11 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-40"
              >
                {m.change.isPending ? 'Đang xử lý…' : 'Gỡ nhân viên'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
