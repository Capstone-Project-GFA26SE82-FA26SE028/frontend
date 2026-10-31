import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { SummaryCards } from '../../../../components/SummaryCards/SummaryCards'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import {
  Pagination,
  PAGE_SIZE,
} from '../../../../components/Pagination/Pagination'
import { Panel } from '../../../../components/Panel/Panel'
import { QueryState } from '../../menu-management/components/QueryState'
import { HistoryFilters } from '../components/HistoryFilters'
import { InventoryTabs } from '../components/InventoryTabs'
import { MovementTable } from '../components/MovementTable'
import { StockRefresh } from '../components/StockRefresh'
import { useStock, useStockMovements } from '../hooks/useStock'
import { filterMovements, movementTotals } from '../utils/stock'

export function StockVariancePage() {
  const [params, setParams] = useSearchParams()
  const ingredientId = params.get('ingredientId') || ''
  const [from, setFrom] = useState('')
  const [until, setUntil] = useState('')
  const [page, setPage] = useState(1)
  const stock = useStock()
  const movements = useStockMovements(ingredientId)
  const ingredient = stock.data?.find(
    (value) => value.ingredientId === ingredientId,
  )
  const filtered = filterMovements(movements.data || [], from, until)
  const outgoing = filtered.filter((movement) => movement.quantityChange < 0)
  const totals = movementTotals(filtered)
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(outgoing.length / PAGE_SIZE)),
  )
  const refresh = () => {
    void stock.refetch()
    void movements.refetch()
  }
  return (
    <>
      <PageHeading
        eyebrow="Theo dõi kho"
        title="Tiêu hao và chênh lệch"
        description="Xem lượng xuất nguyên liệu ghi nhận và khả năng đối chiếu tiêu hao với định mức công thức."
      />
      <InventoryTabs />
      <Panel className="mb-5 p-4">
        <QueryState
          pending={stock.isPending}
          error={stock.error}
          retry={() => void stock.refetch()}
        >
          <HistoryFilters
            ingredients={stock.data || []}
            ingredientId={ingredientId}
            select={(id) => {
              setParams(id ? { ingredientId: id } : {})
              setPage(1)
            }}
            from={from}
            until={until}
            setFrom={(value) => {
              setFrom(value)
              setPage(1)
            }}
            setUntil={(value) => {
              setUntil(value)
              setPage(1)
            }}
          />
        </QueryState>
      </Panel>
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <h2 className="font-semibold">Chưa có dữ liệu chênh lệch tiêu hao</h2>
        <p className="mt-1">
          Để đối chiếu chính xác cần số lượng món đã chế biến, phiên bản công
          thức lịch sử, kiểm kê và lượng hủy được xác định riêng. Báo cáo chưa
          có các dữ liệu này. Chỉ dựa vào lượng xuất kho không thể xác định tiêu
          hao hoặc hao hụt thực tế.
        </p>
        <p className="mt-1">
          Variance = (actual usage − expected usage) / expected usage × 100%,
          only when expected usage is greater than zero. No stock balances are
          adjusted by this report.
        </p>
      </div>
      {!ingredient ? (
        <Panel className="p-12 text-center text-sm text-slate-500">
          Chọn nguyên liệu để xem lượng xuất ghi nhận.
        </Panel>
      ) : (
        <QueryState
          pending={movements.isPending}
          error={movements.error}
          retry={() => void movements.refetch()}
        >
          <SummaryCards
            items={[
              {
                label: 'Lượng xuất ghi nhận',
                value: `${totals.outgoing.toLocaleString('en-GB')} ${ingredient.baseUnit}`,
                icon: 'minus',
                note: 'Tất cả biến động âm trong kỳ đã chọn',
              },
              {
                label: 'Tiêu hao dự kiến',
                value: 'Chưa có dữ liệu',
                icon: 'clipboard',
                note: 'Cần số lượng đã chế biến và công thức đã lưu',
              },
              {
                label: 'Tiêu hao thực tế',
                value: 'Chưa có dữ liệu',
                icon: 'box',
                note: 'Cần đối chiếu dữ liệu xuất kho và kiểm kê',
              },
              {
                label: 'Chênh lệch tiêu hao',
                value: 'Chưa có dữ liệu',
                icon: 'chart',
                note: 'Dữ liệu còn thiếu không được xem là 0',
              },
            ]}
          />
          <Panel className="mb-5 p-4">
            <StockRefresh
              updatedAt={movements.dataUpdatedAt}
              refreshing={stock.isFetching || movements.isFetching}
              refresh={refresh}
            />
          </Panel>
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
              <div>
                <h2 className="font-semibold">
                  Lượng xuất ghi nhận · {ingredient.ingredientName}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Kiểm tra loại giao dịch và lý do trước khi xác minh chênh
                  lệch.
                </p>
              </div>
              <Link
                to={`/manager/stock-history?ingredientId=${ingredientId}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                Tất cả biến động và lô hàng
              </Link>
            </div>
            <QueryState
              pending={false}
              error={null}
              retry={refresh}
              empty={!outgoing.length}
            >
              <MovementTable
                movements={outgoing.slice(
                  (currentPage - 1) * PAGE_SIZE,
                  currentPage * PAGE_SIZE,
                )}
                unit={ingredient.baseUnit}
              />
            </QueryState>
            <Pagination
              locale="vi"
              total={outgoing.length}
              page={currentPage}
              onPage={setPage}
            />
          </Panel>
        </QueryState>
      )}
    </>
  )
}
