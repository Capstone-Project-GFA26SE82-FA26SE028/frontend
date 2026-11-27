import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Pagination } from '../../../../components/Pagination/Pagination'
import {
  getRegistrations,
  registrationError,
  type RegistrationStatus,
} from '../api/registrationApi'
import { RegistrationDetail } from '../components/RegistrationDetail'
import { registrationDate, statusLabels } from '../format'

export function RegistrationsPage() {
  const [status, setStatus] = useState<RegistrationStatus | ''>('Pending')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const list = useQuery({
    queryKey: ['restaurant-registrations', 'list', { page, status }],
    queryFn: ({ signal }) => getRegistrations(page, status, signal),
  })
  if (
    list.isSuccess &&
    page > Math.max(1, Math.ceil(list.data.totalCount / 10))
  )
    setPage(Math.max(1, Math.ceil(list.data.totalCount / 10)))
  return (
    <>
      <PageHeading
        title="Hồ sơ đăng ký nhà hàng"
        description="Tiếp nhận hồ sơ đối tác, kiểm tra giấy tờ và cấp quyền admin nhà hàng."
        action={
          <button
            className="btn-secondary min-h-11"
            disabled={list.isFetching}
            onClick={() => void list.refetch()}
          >
            {list.isFetching ? 'Đang tải…' : 'Làm mới'}
          </button>
        }
      />
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <label className="flex items-center gap-3 text-sm font-semibold">
            Trạng thái
            <select
              className="field w-auto"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as RegistrationStatus | '')
                setPage(1)
              }}
            >
              <option value="">Tất cả</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {list.data && (
            <p className="text-sm text-slate-500">
              {list.data.totalCount} hồ sơ
            </p>
          )}
        </div>
        {list.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Đang tải hồ sơ…
          </p>
        ) : list.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert" className="text-rose-700">
              {registrationError(list.error)}
            </p>
            <button
              className="btn-secondary"
              onClick={() => void list.refetch()}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            {!list.data.items.length ? (
              <div className="p-12 text-center">
                <h2 className="font-semibold">
                  Chưa có hồ sơ{' '}
                  {status ? statusLabels[status].toLowerCase() : ''}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Hồ sơ gửi từ trang đăng ký nhà hàng sẽ xuất hiện tại đây.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {[
                        'Nhà hàng',
                        'Email người đăng ký',
                        'Ngày nộp',
                        'Trạng thái',
                        'Thao tác',
                      ].map((label) => (
                        <th
                          key={label}
                          scope="col"
                          className="whitespace-nowrap px-4 py-3 font-medium"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.data.items.map((item) => (
                      <tr
                        key={item.registrationId}
                        className="hover:bg-slate-50"
                      >
                        <td className="min-w-48 px-4 py-4">
                          <p className="font-semibold">
                            {item.restaurant.restaurantName}
                          </p>
                          <p className="mt-1 max-w-xs break-words text-xs text-slate-500">
                            {item.restaurant.address}
                          </p>
                        </td>
                        <td className="break-all px-4 py-4">{item.email}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {registrationDate(item.submittedAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Approved' ? 'bg-emerald-50 text-emerald-800' : item.status === 'Provisioning' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'}`}
                          >
                            {statusLabels[item.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            className="btn-secondary min-h-11 whitespace-nowrap"
                            onClick={() => setSelectedId(item.registrationId)}
                          >
                            Xem hồ sơ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination
              total={list.data.totalCount}
              page={page}
              size={10}
              onPage={setPage}
            />
          </>
        )}
      </div>
      {selectedId && (
        <RegistrationDetail
          key={selectedId}
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
