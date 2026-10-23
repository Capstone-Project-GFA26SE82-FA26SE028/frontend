import { Modal } from '../../../../components/Modal/Modal'
import {
  PageHeading,
  EmptyState,
  Pagination,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
import { useTables } from '../hooks/useTables'
import { tableError, isTableConflict } from '../api/tableApi'
import { TablesByArea } from '../components/TablesByArea'
import { TableForm } from '../components/TableForm'
import { TableFilters } from '../components/TableFilters'
import { TableDetail } from '../components/TableDetail'
import { TableMoveForm } from '../components/TableMoveForm'
export function TablesPage() {
  const m = useTables(),
    { target, detail, mutation } = m
  const areas = m.options.data?.areas || [],
    restaurants = m.options.data?.restaurants || [],
    table = detail.data
  const currentArea = areas.find((a) => a.areaId === table?.areaId)
  return (
    <>
      <PageHeading
        title="Tables"
        description="Manage tables and seating across your restaurants."
        action={
          <button className={primaryButton} onClick={() => m.open('create')}>
            + Add table
          </button>
        }
      />
      {m.options.isError && (
        <div
          className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
          role="alert"
        >
          Unable to load restaurants and areas.{' '}
          <button
            className="underline"
            onClick={() => void m.options.refetch()}
          >
            Retry
          </button>
        </div>
      )}
      <TableFilters
        search={m.search}
        onSearch={m.setSearch}
        restaurantId={m.restaurantId}
        onRestaurant={m.filterRestaurant}
        areaId={m.areaId}
        onArea={m.filterArea}
        status={m.status}
        onStatus={m.filterStatus}
        restaurants={restaurants}
        areas={areas}
        onReset={m.reset}
      />
      {m.list.isPending ? (
        <p role="status" className="p-8 text-center">
          Loading tables...
        </p>
      ) : m.list.isError ? (
        <div className="space-y-3 p-8 text-center">
          <p role="alert">{tableError(m.list.error)}</p>
          <button
            className={secondaryButton}
            onClick={() => void m.list.refetch()}
          >
            Try again
          </button>
        </div>
      ) : (
        <fieldset
          className="min-w-0"
          disabled={m.list.isPlaceholderData}
          aria-busy={m.list.isFetching}
        >
          {!m.list.data.items.length ? (
            <EmptyState
              title="No tables found"
              description="Change your filters or add a table."
            />
          ) : (
            <TablesByArea
              tables={m.list.data.items}
              areas={areas}
              restaurants={restaurants}
              onAction={m.open}
            />
          )}
          <div className="mt-5 rounded-xl bg-white">
            <Pagination
              locale="en"
              total={m.list.data.totalCount}
              page={m.page}
              size={12}
              onPage={m.changePage}
            />
          </div>
        </fieldset>
      )}
      {target && (
        <Modal
          title={
            target.mode === 'create'
              ? 'Add table'
              : target.mode === 'edit'
                ? 'Edit table'
                : target.mode === 'view'
                  ? 'Table details'
                  : target.mode === 'move'
                    ? 'Move table'
                    : target.mode === 'delete'
                      ? 'Delete table'
                      : table?.isActive
                        ? 'Deactivate table'
                        : 'Activate table'
          }
          size={
            target.mode === 'create' || target.mode === 'edit'
              ? 'wide'
              : 'default'
          }
          closeLabel="Close"
          onClose={m.close}
        >
          {target.mode !== 'create' && isTableConflict(mutation.error) && (
            <div className="mx-6 mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              <p>
                The request conflicts with the current table state. Reload to
                use the latest data; unsaved changes will be reset.
              </p>
              <button
                disabled={detail.isFetching || mutation.isPending}
                className="mt-2 font-semibold underline"
                onClick={() => void m.reload()}
              >
                Reload table
              </button>
            </div>
          )}
          {target.mode !== 'create' && detail.isPending ? (
            <p role="status" className="p-6">
              Loading table...
            </p>
          ) : target.mode !== 'create' && detail.isError ? (
            <div className="space-y-3 p-6">
              <p role="alert">{tableError(detail.error)}</p>
              <button
                className={secondaryButton}
                onClick={() => void m.reload()}
              >
                Try again
              </button>
            </div>
          ) : m.options.isPending ? (
            <p role="status" className="p-6">
              Loading restaurants and areas...
            </p>
          ) : m.options.isError ? (
            <div className="p-6">
              <p role="alert">Unable to load restaurants and areas.</p>
              <button
                className={secondaryButton}
                onClick={() => void m.options.refetch()}
              >
                Try again
              </button>
            </div>
          ) : target.mode === 'create' ? (
            <TableForm
              restaurants={restaurants}
              areas={areas}
              initialRestaurantId={m.restaurantId}
              initialAreaId={m.areaId}
              pending={mutation.isPending}
              onClose={m.close}
              onSave={(values) =>
                mutation.mutateAsync({ kind: 'save', values })
              }
            />
          ) : (
            table &&
            (target.mode === 'view' ? (
              <TableDetail
                table={table}
                areaName={currentArea?.areaName || 'Area unavailable'}
                restaurantName={
                  restaurants.find(
                    (r) => r.restaurantId === currentArea?.restaurantId,
                  )?.restaurantName || 'Restaurant unavailable'
                }
                onClose={m.close}
                onEdit={() => m.open('edit', table.tableId)}
              />
            ) : target.mode === 'edit' ? (
              <TableForm
                key={table.tableId + '-' + m.revision}
                table={table}
                restaurants={restaurants}
                areas={areas}
                initialRestaurantId={currentArea?.restaurantId || ''}
                initialAreaId={table.areaId}
                pending={mutation.isPending}
                onClose={m.close}
                onSave={(values) =>
                  mutation.mutateAsync({
                    kind: 'save',
                    values,
                    id: table.tableId,
                  })
                }
              />
            ) : target.mode === 'move' ? (
              <TableMoveForm
                key={table.tableId + '-' + m.revision}
                table={table}
                areas={areas}
                pending={mutation.isPending}
                onClose={m.close}
                onMove={(areaId) =>
                  mutation.mutateAsync({
                    kind: 'move',
                    id: table.tableId,
                    areaId,
                    version: table.version,
                  })
                }
              />
            ) : (
              <div className="space-y-5 p-6">
                <p className="break-words text-sm text-slate-600">
                  {target.mode === 'delete'
                    ? 'Delete ' +
                      table.tableCode +
                      '? Tables with QR codes, reservations or service history cannot be deleted.'
                    : (table.isActive ? 'Deactivate ' : 'Activate ') +
                      table.tableCode +
                      '?'}
                </p>
                {mutation.isError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
                  >
                    {tableError(mutation.error)}
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    disabled={mutation.isPending}
                    className={secondaryButton}
                    onClick={m.close}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={mutation.isPending || detail.isFetching}
                    className={
                      target.mode === 'delete'
                        ? 'rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50'
                        : primaryButton
                    }
                    onClick={() =>
                      mutation.mutate(
                        target.mode === 'delete'
                          ? {
                              kind: 'delete',
                              id: table.tableId,
                              version: table.version,
                            }
                          : {
                              kind: 'status',
                              id: table.tableId,
                              isActive: !table.isActive,
                              version: table.version,
                            },
                      )
                    }
                  >
                    {mutation.isPending
                      ? 'Saving...'
                      : target.mode === 'delete'
                        ? 'Delete'
                        : table.isActive
                          ? 'Deactivate'
                          : 'Activate'}
                  </button>
                </div>
              </div>
            ))
          )}
        </Modal>
      )}
    </>
  )
}
