import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import {
  fieldClass,
  PageHeading,
  SearchField,
  secondaryButton,
  SummaryCards,
} from '../../../admin/components/AdminUI'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { matches } from '../../../admin/utils'
import { QueryState } from '../../menu-management/components/QueryState'
import { OperationsTabs } from '../components/OperationsTabs'
import { OperationsRefresh } from '../components/OperationsRefresh'
import { useOperationsTables } from '../hooks/useOperations'
import type { MonitoredTable } from '../types/operations'

export function TableMonitoringPage() {
  const tables = useOperationsTables()
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('')
  const [restaurant, setRestaurant] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<MonitoredTable | null>(null)
  const all = tables.data || []
  const visible = all.filter(
    (table) =>
      matches(search, table.tableCode, table.areaName) &&
      (!area || table.areaId === area) &&
      (!restaurant || table.restaurantId === restaurant) &&
      (!status ||
        (table.openSessionIds.length ? 'serving' : 'vacant') === status),
  )
  const areas = [
    ...new Map(
      all
        .filter((t) => !restaurant || t.restaurantId === restaurant)
        .map((table) => [table.areaId, table.areaName]),
    ).entries(),
  ]
  const detail = all.find((table) => table.tableId === selected?.tableId)
  return (
    <>
      <PageHeading
        eyebrow="Theo dõi vận hành"
        title="Trạng thái bàn"
        description="Xem bàn đang hoạt động theo khu vực và các phiên phục vụ đang mở."
      />
      <OperationsTabs />
      <QueryState
        pending={tables.isPending}
        error={tables.error}
        retry={() => void tables.refetch()}
      >
        <SummaryCards
          items={[
            {
              label: 'Bàn đang hoạt động',
              value: all.length,
              icon: 'utensils',
              note: 'Bàn hoạt động thuộc khu vực đang hoạt động',
            },
            {
              label: 'Đang phục vụ',
              value: all.filter((t) => t.openSessionIds.length).length,
              icon: 'service',
              note: 'Có ít nhất một phiên đang mở',
            },
            {
              label: 'Không có phiên mở',
              value: all.filter((t) => !t.openSessionIds.length).length,
              icon: 'grid',
              note: 'Kiểm tra vệ sinh trước khi xếp khách',
            },
            {
              label: 'Khu vực',
              value: new Set(all.map((t) => t.areaId)).size,
              icon: 'store',
              note: 'Có trong dữ liệu theo dõi',
            },
          ]}
        />
        <OperationsRefresh
          updatedAt={tables.dataUpdatedAt}
          refreshing={tables.isFetching}
          refresh={() => void tables.refetch()}
        />
        <Panel className="mb-5 p-4">
          <div className="flex flex-wrap gap-3">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="Tìm bàn hoặc khu vực…"
            />
            <select
              aria-label="Nhà hàng"
              className={`${fieldClass} sm:w-60`}
              value={restaurant}
              onChange={(e) => {
                setRestaurant(e.target.value)
                setArea('')
              }}
            >
              <option value="">Tất cả nhà hàng</option>
              {[...new Set(all.map((t) => t.restaurantId))].map((id, index) => (
                <option key={id} value={id}>
                  Nhà hàng {index + 1} · {id.slice(-8)}
                </option>
              ))}
            </select>
            <select
              aria-label="Khu vực"
              className={`${fieldClass} sm:w-44`}
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">Tất cả khu vực</option>
              {areas.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <select
              aria-label="Trạng thái bàn"
              className={`${fieldClass} sm:w-48`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="serving">Đang phục vụ</option>
              <option value="vacant">Không có phiên mở</option>
            </select>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Trạng thái phục vụ dựa trên phiên đang mở. Màn hình này chưa có
            trạng thái thanh toán và không suy luận từ việc bàn có khách.
          </p>
        </Panel>
        <QueryState
          pending={false}
          error={null}
          retry={() => void tables.refetch()}
          empty={!visible.length}
        >
          <div className="space-y-5">
            {areas
              .filter(([id]) => visible.some((t) => t.areaId === id))
              .map(([id, name]) => (
                <section key={id}>
                  <h2 className="mb-3 font-semibold">{name}</h2>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {visible
                      .filter((t) => t.areaId === id)
                      .map((table) => (
                        <button
                          key={table.tableId}
                          onClick={() => setSelected(table)}
                          className={`rounded-2xl border p-5 text-left transition-shadow hover:shadow-md ${table.openSessionIds.length ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Icon name="utensils" size={24} />
                            <Badge
                              tone={
                                table.openSessionIds.length ? 'green' : 'slate'
                              }
                            >
                              {table.openSessionIds.length
                                ? 'Đang phục vụ'
                                : 'Không có phiên mở'}
                            </Badge>
                          </div>
                          <p className="mt-4 text-xl font-bold">
                            {table.tableCode}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            Vệ sinh: {table.cleaningStatus}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {table.openSessionIds.length} phiên đang mở
                          </p>
                        </button>
                      ))}
                  </div>
                </section>
              ))}
          </div>
        </QueryState>
      </QueryState>
      {selected && (
        <Modal
          title={`Table ${selected.tableCode}`}
          closeLabel="Đóng"
          onClose={() => setSelected(null)}
        >
          <div className="space-y-4 p-6">
            {!detail ? (
              <p className="text-sm text-slate-500">
                Bàn này không còn trong dữ liệu theo dõi mới nhất.
              </p>
            ) : (
              <>
                <p>
                  Khu vực: <strong>{detail.areaName}</strong>
                </p>
                <p className="text-sm">Vệ sinh: {detail.cleaningStatus}</p>
                <h3 className="font-semibold">Phiên phục vụ đang mở</h3>
                {detail.openSessionIds.length ? (
                  detail.openSessionIds.map((id) => (
                    <p
                      key={id}
                      className="break-all rounded-xl bg-slate-50 p-3 text-sm"
                    >
                      {id}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Không có phiên đang mở.
                  </p>
                )}
                <p className="text-sm text-slate-500">
                  Thông tin thanh toán: Chưa có.
                </p>
                <Link
                  className={secondaryButton}
                  to={`/manager/kitchen-monitoring?tableId=${detail.tableId}`}
                >
                  Xem tiến độ bếp
                </Link>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
