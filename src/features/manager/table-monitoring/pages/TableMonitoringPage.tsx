import { useState } from 'react'
import { useDebounce } from '../../../../hooks/useDebounce'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Modal } from '../../../../components/Modal/Modal'
import { useTables } from '../hooks/useTables'
import { tableError } from '../utils/table'
import { TableFilters } from '../components/TableFilters'
import { TablesByArea } from '../components/TablesByArea'
import { TableDetail } from '../components/TableDetail'
import { TableQrModal } from '../components/TableQrModal'
export function TableMonitoringPage() {
  const [search, setSearch] = useState('')
  const [area, setArea] = useState({ scope: '', id: '' })
  const [status, setStatus] = useState('')
  const [selection, setSelection] = useState<{
    scope: string
    id: string
    mode: 'view' | 'qr'
  } | null>(null)
  const term = useDebounce(search.trim(), 300)
  // Keep selections and area filters scoped to the current restaurant and user.
  const m = useTables({ search: term, areaId: area.id, status }, area.scope)
  const areaId = area.scope === m.scope ? area.id : ''
  const areas = m.areas.data || []
  const tables = (m.tables.data || []).filter((table) =>
    areas.some(
      (value) =>
        value.areaId === table.areaId && value.restaurantId === m.restaurantId,
    ),
  )
  const selected =
    selection?.scope === m.scope
      ? tables.find((table) => table.tableId === selection.id)
      : undefined
  const refresh = () => {
    void m.tables.refetch()
    void m.areas.refetch()
  }
  return (
    <>
      <PageHeading
        title="Bàn & QR"
        description="Xem bàn, chỗ ngồi và quản lý mã QR trong nhà hàng của bạn."
        action={
          <button
            disabled={
              !m.restaurantId || m.tables.isFetching || m.areas.isFetching
            }
            onClick={refresh}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40"
          >
            Làm mới
          </button>
        }
      />
      {!m.restaurantId ? (
        <EmptyState
          title="Chưa được phân công nhà hàng"
          description="Cần được phân công nhà hàng để xem danh sách bàn."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Dữ liệu tự cập nhật mỗi 15 giây.
          </p>
          <TableFilters
            search={search}
            onSearch={setSearch}
            areaId={areaId}
            onArea={(id) => setArea({ scope: m.scope, id })}
            status={status}
            onStatus={setStatus}
            areas={areas}
            onReset={() => {
              setSearch('')
              setArea({ scope: m.scope, id: '' })
              setStatus('')
            }}
          />
          {m.tables.isError || m.areas.isError ? (
            <div className="space-y-3 p-8 text-center">
              <p role="alert">{tableError(m.tables.error || m.areas.error)}</p>
              <button
                className="min-h-11 px-4 text-emerald-700 underline"
                onClick={refresh}
              >
                Thử lại
              </button>
            </div>
          ) : m.tables.isPending || m.areas.isPending ? (
            <p role="status" className="p-8 text-center">
              Đang tải danh sách bàn…
            </p>
          ) : !tables.length ? (
            <EmptyState
              title="Không tìm thấy bàn"
              description="Thử thay đổi bộ lọc hoặc đợi Admin cập nhật bàn."
            />
          ) : (
            <TablesByArea
              tables={tables}
              areas={areas}
              onView={(id) =>
                setSelection({ scope: m.scope, id, mode: 'view' })
              }
              onQr={(id) => setSelection({ scope: m.scope, id, mode: 'qr' })}
            />
          )}
        </>
      )}
      {selected &&
        !m.tables.isError &&
        !m.areas.isError &&
        (selection?.mode === 'qr' ? (
          <TableQrModal
            key={`${m.scope}:${selected.tableId}`}
            tableId={selected.tableId}
            onClose={() => setSelection(null)}
          />
        ) : (
          <Modal title="Chi tiết bàn" onClose={() => setSelection(null)}>
            <TableDetail
              table={selected}
              areaName={
                areas.find((value) => value.areaId === selected.areaId)
                  ?.areaName || 'Chưa có thông tin khu vực'
              }
              onClose={() => setSelection(null)}
              onQr={() =>
                setSelection({
                  scope: m.scope,
                  id: selected.tableId,
                  mode: 'qr',
                })
              }
            />
          </Modal>
        ))}
    </>
  )
}
