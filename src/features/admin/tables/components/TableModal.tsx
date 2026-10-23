import { Modal } from '../../../../components/Modal/Modal'
import { primaryButton, secondaryButton } from '../../components/AdminUI'
import { tableError, isTableVersionConflict } from '../api/tableApi'
import type { useTables } from '../hooks/useTables'
import { TableForm } from './TableForm'
import { TableDetail } from './TableDetail'
import { TableMoveForm } from './TableMoveForm'
export function TableModal({
  management: m,
}: {
  management: ReturnType<typeof useTables>
}) {
  const { target, detail, mutation } = m
  if (!target) return null
  const areas = m.options.data?.areas || []
  const restaurants = m.options.data?.restaurants || []
  const table = detail.data
  const currentArea = areas.find((area) => area.areaId === table?.areaId)
  return (
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
        target.mode === 'create' || target.mode === 'edit' ? 'wide' : 'default'
      }
      closeLabel="Close"
      onClose={m.close}
    >
      {target.mode !== 'create' && isTableVersionConflict(mutation.error) && (
        <div className="mx-6 mt-5 text-sm text-emerald-700">
          <button
            disabled={detail.isFetching || mutation.isPending}
            className="font-semibold underline disabled:opacity-50"
            title="Reload the latest data and reset unsaved changes"
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
          <button className={secondaryButton} onClick={() => void m.reload()}>
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
          onSave={(values) => mutation.mutateAsync({ kind: 'save', values })}
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
  )
}
