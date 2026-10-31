import { Modal } from '../../../../components/Modal/Modal'

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
          ? 'Thêm bàn'
          : target.mode === 'edit'
            ? 'Sửa bàn'
            : target.mode === 'view'
              ? 'Chi tiết bàn'
              : target.mode === 'move'
                ? 'Chuyển bàn'
                : target.mode === 'delete'
                  ? 'Xóa bàn'
                  : table?.isActive
                    ? 'Ngừng hoạt động bàn'
                    : 'Kích hoạt bàn'
      }
      size={
        target.mode === 'create' || target.mode === 'edit' ? 'wide' : 'default'
      }
      closeLabel="Đóng"
      onClose={m.close}
    >
      {target.mode !== 'create' && isTableVersionConflict(mutation.error) && (
        <div className="mx-6 mt-5 text-sm text-emerald-700">
          <button
            disabled={detail.isFetching || mutation.isPending}
            className="font-semibold underline disabled:opacity-50"
            title="Tải dữ liệu mới nhất và đặt lại các thay đổi chưa lưu"
            onClick={() => void m.reload()}
          >
            Tải lại bàn
          </button>
        </div>
      )}
      {target.mode !== 'create' && detail.isPending ? (
        <p role="status" className="p-6">
          Đang tải bàn…
        </p>
      ) : target.mode !== 'create' && detail.isError ? (
        <div className="space-y-3 p-6">
          <p role="alert">{tableError(detail.error)}</p>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={() => void m.reload()}
          >
            Thử lại
          </button>
        </div>
      ) : m.options.isPending ? (
        <p role="status" className="p-6">
          Đang tải nhà hàng và khu vực…
        </p>
      ) : m.options.isError ? (
        <div className="p-6">
          <p role="alert">Không thể tải nhà hàng và khu vực.</p>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={() => void m.options.refetch()}
          >
            Thử lại
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
            areaName={currentArea?.areaName || 'Chưa có thông tin khu vực'}
            restaurantName={
              restaurants.find(
                (r) => r.restaurantId === currentArea?.restaurantId,
              )?.restaurantName || 'Chưa có thông tin nhà hàng'
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
                ? 'Xóa ' +
                  table.tableCode +
                  '? Không thể xóa bàn có mã QR, lịch đặt hoặc lịch sử phục vụ.'
                : (table.isActive ? 'Ngừng hoạt động ' : 'Kích hoạt ') +
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
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                onClick={m.close}
              >
                Hủy
              </button>
              <button
                disabled={mutation.isPending || detail.isFetching}
                className={
                  target.mode === 'delete'
                    ? 'rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50'
                    : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40'
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
                  ? 'Đang lưu…'
                  : target.mode === 'delete'
                    ? 'Xóa'
                    : table.isActive
                      ? 'Ngừng hoạt động'
                      : 'Kích hoạt'}
              </button>
            </div>
          </div>
        ))
      )}
    </Modal>
  )
}
