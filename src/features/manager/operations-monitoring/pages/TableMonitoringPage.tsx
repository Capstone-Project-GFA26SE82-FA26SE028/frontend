import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import {
  Badge,
  fieldClass,
  PageHeading,
  Panel,
  SearchField,
  secondaryButton,
  SummaryCards,
} from '../../../admin/components/AdminUI'
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
        eyebrow="Operations Monitoring"
        title="Table Status"
        description="View active tables by area and inspect their open service sessions."
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
              label: 'Active tables',
              value: all.length,
              icon: 'utensils',
              note: 'Active tables in active areas',
            },
            {
              label: 'Serving',
              value: all.filter((t) => t.openSessionIds.length).length,
              icon: 'service',
              note: 'At least one open session',
            },
            {
              label: 'No open session',
              value: all.filter((t) => !t.openSessionIds.length).length,
              icon: 'grid',
              note: 'Check cleaning status before seating',
            },
            {
              label: 'Areas',
              value: new Set(all.map((t) => t.areaId)).size,
              icon: 'store',
              note: 'Available in the monitoring data',
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
              placeholder="Search table or area…"
            />
            <select
              aria-label="Restaurant"
              className={`${fieldClass} sm:w-60`}
              value={restaurant}
              onChange={(e) => {
                setRestaurant(e.target.value)
                setArea('')
              }}
            >
              <option value="">All restaurants</option>
              {[...new Set(all.map((t) => t.restaurantId))].map((id, index) => (
                <option key={id} value={id}>
                  Restaurant {index + 1} · {id.slice(-8)}
                </option>
              ))}
            </select>
            <select
              aria-label="Area"
              className={`${fieldClass} sm:w-44`}
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">All areas</option>
              {areas.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <select
              aria-label="Table status"
              className={`${fieldClass} sm:w-48`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="serving">Serving</option>
              <option value="vacant">No open session</option>
            </select>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Serving status is based on open sessions. Payment status is not
            available in this view and is not inferred from table occupancy.
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
                                ? 'Serving'
                                : 'No open session'}
                            </Badge>
                          </div>
                          <p className="mt-4 text-xl font-bold">
                            {table.tableCode}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            Cleaning: {table.cleaningStatus}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {table.openSessionIds.length} open session(s)
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
          closeLabel="Close"
          onClose={() => setSelected(null)}
        >
          <div className="space-y-4 p-6">
            {!detail ? (
              <p className="text-sm text-slate-500">
                This table is no longer present in the latest monitoring data.
              </p>
            ) : (
              <>
                <p>
                  Area: <strong>{detail.areaName}</strong>
                </p>
                <p className="text-sm">Cleaning: {detail.cleaningStatus}</p>
                <h3 className="font-semibold">Open service sessions</h3>
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
                  <p className="text-sm text-slate-500">No open sessions.</p>
                )}
                <p className="text-sm text-slate-500">
                  Payment details: Not available.
                </p>
                <Link
                  className={secondaryButton}
                  to={`/manager/kitchen-monitoring?tableId=${detail.tableId}`}
                >
                  View kitchen progress
                </Link>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
