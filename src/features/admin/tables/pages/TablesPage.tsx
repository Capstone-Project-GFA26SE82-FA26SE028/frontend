import { useState } from 'react'
import { TableQrModal } from '../components/TableQrModal'
import { TableModal } from '../components/TableModal'

import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { useTables } from '../hooks/useTables'
import { tableError } from '../api/tableApi'
import { TablesByArea } from '../components/TablesByArea'
import { TableFilters } from '../components/TableFilters'
export function TablesPage() {
  const [qrTarget, setQrTarget] = useState<{
    id: string
    scope: string
  } | null>(null)
  const m = useTables()
  const areas = m.options.data?.areas || []
  const qrTableId = qrTarget?.scope === m.scope ? qrTarget.id : null
  return (
    <>
      <PageHeading
        title="Bàn"
        description="Quản lý bàn và chỗ ngồi trong nhà hàng của bạn."
        action={
          <button
            disabled={!m.canManage || m.list.isError || m.options.isError}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
            onClick={() => m.open('create')}
          >
            + Thêm bàn
          </button>
        }
      />
      {m.options.isError && (
        <div
          className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
          role="alert"
        >
          Không thể tải khu vực.{' '}
          <button
            className="underline"
            onClick={() => void m.options.refetch()}
          >
            Thử lại
          </button>
        </div>
      )}
      <TableFilters
        search={m.search}
        onSearch={m.setSearch}
        areaId={m.areaId}
        onArea={m.filterArea}
        status={m.status}
        onStatus={m.filterStatus}
        areas={areas}
        onReset={m.reset}
      />
      {m.list.isPending ? (
        <p role="status" className="p-8 text-center">
          Đang tải danh sách bàn…
        </p>
      ) : m.list.isError ? (
        <div className="space-y-3 p-8 text-center">
          <p role="alert">{tableError(m.list.error)}</p>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={() => void m.list.refetch()}
          >
            Thử lại
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
              title="Không tìm thấy bàn"
              description="Thay đổi bộ lọc hoặc thêm bàn."
            />
          ) : (
            <TablesByArea
              tables={m.list.data.items}
              areas={areas}
              onAction={(mode, id) =>
                mode === 'qr'
                  ? setQrTarget({ id, scope: m.scope })
                  : m.open(mode, id)
              }
            />
          )}
        </fieldset>
      )}
      <TableModal management={m} />
      {qrTableId && (
        <TableQrModal
          key={qrTableId}
          tableId={qrTableId}
          onClose={() => setQrTarget(null)}
        />
      )}
    </>
  )
}
