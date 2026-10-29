import { useState } from 'react'
import { TableQrModal } from '../components/TableQrModal'
import { TableModal } from '../components/TableModal'
import {
  PageHeading,
  EmptyState,
  Pagination,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
import { useTables } from '../hooks/useTables'
import { tableError } from '../api/tableApi'
import { TablesByArea } from '../components/TablesByArea'
import { TableFilters } from '../components/TableFilters'
export function TablesPage() {
  const [qrTableId, setQrTableId] = useState<string | null>(null)
  const m = useTables()
  const areas = m.options.data?.areas || [],
    restaurants = m.options.data?.restaurants || []
  return (
    <>
      <PageHeading
        title="Bàn"
        description="Quản lý bàn và chỗ ngồi tại các nhà hàng."
        action={
          <button className={primaryButton} onClick={() => m.open('create')}>
            + Thêm bàn
          </button>
        }
      />
      {m.options.isError && (
        <div
          className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
          role="alert"
        >
          Không thể tải nhà hàng và khu vực.{' '}
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
          Đang tải danh sách bàn…
        </p>
      ) : m.list.isError ? (
        <div className="space-y-3 p-8 text-center">
          <p role="alert">{tableError(m.list.error)}</p>
          <button
            className={secondaryButton}
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
              restaurants={restaurants}
              onAction={(mode, id) =>
                mode === 'qr' ? setQrTableId(id) : m.open(mode, id)
              }
            />
          )}
          <div className="mt-5 rounded-xl bg-white">
            <Pagination
              locale="vi"
              total={m.list.data.totalCount}
              page={m.page}
              size={12}
              onPage={m.changePage}
            />
          </div>
        </fieldset>
      )}
      <TableModal management={m} />
      {qrTableId && (
        <TableQrModal
          key={qrTableId}
          tableId={qrTableId}
          onClose={() => setQrTableId(null)}
        />
      )}
    </>
  )
}
