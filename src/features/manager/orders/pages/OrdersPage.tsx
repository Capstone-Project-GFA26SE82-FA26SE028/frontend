import { useState } from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { Badge } from '../../../../components/Badge/Badge'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import {
  Pagination,
  PAGE_SIZE,
} from '../../../../components/Pagination/Pagination'
import { SummaryCards } from '../../../../components/SummaryCards/SummaryCards'
import {
  useKitchenTasks,
  useOperationsTables,
} from '../../kitchen-monitoring/hooks/useKitchenTasks'
import { kitchenError } from '../../kitchen-monitoring/api/kitchenApi'
import { OperationsRefresh } from '../../kitchen-monitoring/components/OperationsRefresh'
import { OrderDetail } from '../components/OrderDetail'
import {
  channelLabel,
  groupOrders,
  orderDate,
  orderDay,
  progressLabels,
} from '../utils/orders'

const fieldClass = 'field mt-2'

export function OrdersPage() {
  const user = useAppSelector((state) => state.auth.session?.user)
  return (
    <OrdersWorkspace
      key={`${user?.userId}:${user?.restaurantId}`}
      restaurantId={user?.restaurantId}
    />
  )
}

function OrdersWorkspace({ restaurantId }: { restaurantId?: string | null }) {
  const tasks = useKitchenTasks()
  const tables = useOperationsTables()
  const [search, setSearch] = useState('')
  const [channel, setChannel] = useState('')
  const [progress, setProgress] = useState('')
  const [tableId, setTableId] = useState('')
  const [from, setFrom] = useState('')
  const [until, setUntil] = useState('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const all = groupOrders(tasks.data || [])
  const tableName = (id: string) =>
    tables.data?.find((table) => table.tableId === id)?.tableCode || id
  const invalidRange = !!from && !!until && from > until
  const term = search.trim().toLocaleLowerCase('vi-VN')
  const filtered = all.filter(
    (order) =>
      !invalidRange &&
      (!channel || order.channel === channel) &&
      (!progress || order.progress === progress) &&
      (!tableId || order.tableIds.includes(tableId)) &&
      (!from || orderDay(order.queuedAt) >= from) &&
      (!until || orderDay(order.queuedAt) <= until) &&
      (!term ||
        [
          order.orderNumber,
          order.orderId,
          ...order.tableIds.map(tableName),
          ...order.tasks.map((task) => task.itemName),
        ].some((value) => value.toLocaleLowerCase('vi-VN').includes(term))),
  )
  const selected = all.find((order) => order.orderId === selectedId)
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  )
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function filter(setter: (value: string) => void, value: string) {
    setter(value)
    setPage(1)
  }
  function reset() {
    setSearch('')
    setChannel('')
    setProgress('')
    setTableId('')
    setFrom('')
    setUntil('')
    setPage(1)
  }

  if (!restaurantId)
    return (
      <>
        <PageHeading
          title="Quản lí đơn hàng"
          description="Theo dõi các order của nhà hàng."
        />
        <p role="alert" className="rounded-xl bg-amber-50 p-4 text-amber-900">
          Tài khoản chưa được gán nhà hàng. Vui lòng kiểm tra phân công trước
          khi xem order.
        </p>
      </>
    )

  return (
    <>
      <PageHeading
        title="Quản lí đơn hàng"
        description="Theo dõi order tại bàn và mang đi đã chuyển bếp, xem món và tiến độ xử lý của từng đơn."
      />
      <OperationsRefresh
        updatedAt={tasks.dataUpdatedAt}
        refreshing={tasks.isFetching || tables.isFetching}
        refresh={() => {
          void tasks.refetch()
          void tables.refetch()
        }}
      />
      {tasks.isError && (
        <div
          role="alert"
          className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {kitchenError(tasks.error)}
          <button
            className="ml-3 underline"
            onClick={() => void tasks.refetch()}
          >
            Thử lại
          </button>
        </div>
      )}
      {tables.isError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"
        >
          Không tải được tên bàn. Danh sách sẽ hiển thị mã định danh bàn.{' '}
          <button className="underline" onClick={() => void tables.refetch()}>
            Thử lại
          </button>
        </p>
      )}
      <SummaryCards
        items={[
          {
            label: 'Order đã chuyển bếp',
            value: tasks.data ? all.length : '—',
            icon: 'clipboard',
            note: 'Tổng số order trong dữ liệu đã tải',
          },
          {
            label: 'Chờ bếp',
            value: tasks.data
              ? all.filter((order) => order.progress === 'Pending').length
              : '—',
            icon: 'clock',
            note: 'Chưa có món bắt đầu xử lý',
          },
          {
            label: 'Đang xử lý',
            value: tasks.data
              ? all.filter((order) => order.progress === 'Cooking').length
              : '—',
            icon: 'fire',
            note: 'Đang nấu hoặc mới xong một phần',
          },
          {
            label: 'Bếp đã hoàn tất',
            value: tasks.data
              ? all.filter((order) => order.progress === 'Ready').length
              : '—',
            icon: 'check',
            note: 'Tất cả món chưa hủy đã xong',
          },
        ]}
      />
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid gap-4 border-b border-slate-100 p-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-semibold">
            Tìm order
            <input
              type="search"
              className={fieldClass}
              placeholder="Mã order, tên món hoặc bàn…"
              maxLength={255}
              value={search}
              onChange={(event) => filter(setSearch, event.target.value)}
            />
          </label>
          <label className="text-sm font-semibold">
            Kênh bán
            <select
              className={fieldClass}
              value={channel}
              onChange={(event) => filter(setChannel, event.target.value)}
            >
              <option value="">Tất cả</option>
              {[...new Set(all.map((order) => order.channel))].map((value) => (
                <option key={value} value={value}>
                  {channelLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Tiến độ bếp
            <select
              className={fieldClass}
              value={progress}
              onChange={(event) => filter(setProgress, event.target.value)}
            >
              <option value="">Tất cả</option>
              {Object.entries(progressLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Bàn
            <select
              className={fieldClass}
              value={tableId}
              onChange={(event) => filter(setTableId, event.target.value)}
            >
              <option value="">Tất cả bàn</option>
              {[...new Set(all.flatMap((order) => order.tableIds))].map(
                (id) => (
                  <option key={id} value={id}>
                    {tableName(id)}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Từ ngày (giờ Việt Nam)
            <input
              className={fieldClass}
              type="date"
              value={from}
              max={until || undefined}
              onChange={(event) => filter(setFrom, event.target.value)}
            />
          </label>
          <label className="text-sm font-semibold">
            Đến ngày (giờ Việt Nam)
            <input
              className={fieldClass}
              type="date"
              value={until}
              min={from || undefined}
              onChange={(event) => filter(setUntil, event.target.value)}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2 xl:col-span-3">
            <button className="btn-secondary min-h-11" onClick={reset}>
              Đặt lại bộ lọc
            </button>
            <p className="text-sm text-slate-500">
              {filtered.length} order phù hợp
            </p>
            {invalidRange && (
              <p role="alert" className="text-sm text-rose-700">
                Ngày kết thúc phải từ ngày bắt đầu trở đi.
              </p>
            )}
          </div>
        </div>
        {tasks.isPending ? (
          <p role="status" className="p-12 text-center text-slate-500">
            Đang tải order…
          </p>
        ) : !tasks.data && tasks.isError ? (
          <p className="p-12 text-center text-slate-500">
            Chưa tải được danh sách order.
          </p>
        ) : !filtered.length ? (
          <div className="p-12 text-center">
            <h2 className="font-semibold">Không có order phù hợp</h2>
            <p className="mt-2 text-sm text-slate-500">
              Thử đổi bộ lọc hoặc làm mới khi có order chuyển bếp.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {[
                    'Order',
                    'Kênh / Bàn',
                    'Chuyển bếp lần đầu',
                    'Món đã xong',
                    'Tiến độ bếp',
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
                {visible.map((order) => {
                  const active = order.tasks.filter(
                    (task) => task.status !== 'Cancelled',
                  )
                  const ready = active
                    .filter(
                      (task) =>
                        task.status === 'Ready' || task.status === 'Served',
                    )
                    .reduce((sum, task) => sum + task.quantity, 0)
                  const total = active.reduce(
                    (sum, task) => sum + task.quantity,
                    0,
                  )
                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50">
                      <td className="min-w-44 px-4 py-4">
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {order.tasks.length} lượt món
                        </p>
                      </td>
                      <td className="max-w-56 break-words px-4 py-4">
                        <p>{channelLabel(order.channel)}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {order.tableIds.map(tableName).join(', ') ||
                            'Không có bàn'}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {orderDate(order.queuedAt)}
                      </td>
                      <td className="px-4 py-4">
                        {ready} / {total}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          tone={
                            order.progress === 'Cancelled'
                              ? 'red'
                              : order.progress === 'Ready'
                                ? 'green'
                                : order.progress === 'Cooking'
                                  ? 'blue'
                                  : 'amber'
                          }
                        >
                          {progressLabels[order.progress]}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          className="btn-secondary min-h-11 whitespace-nowrap"
                          onClick={() => setSelectedId(order.orderId)}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          total={filtered.length}
          page={currentPage}
          size={PAGE_SIZE}
          onPage={setPage}
        />
      </section>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Tiến độ được tổng hợp từ các món đã chuyển bếp. Bếp hoàn tất không đồng
        nghĩa order đã được phục vụ hoặc thanh toán.
      </p>
      {selected && (
        <OrderDetail
          order={selected}
          tableName={tableName}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
