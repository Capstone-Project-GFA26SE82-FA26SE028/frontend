import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { SummaryCards } from '../../../../components/SummaryCards/SummaryCards'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import {
  Pagination,
  PAGE_SIZE,
} from '../../../../components/Pagination/Pagination'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { downloadCsv } from '../../../admin/utils'
import { QueryState } from '../../menu-management/components/QueryState'
import { HistoryFilters } from '../components/HistoryFilters'
import { InventoryTabs } from '../components/InventoryTabs'
import { LotTable } from '../components/LotTable'
import { MovementTable } from '../components/MovementTable'
import { StockRefresh } from '../components/StockRefresh'
import { useStock, useStockLots, useStockMovements } from '../hooks/useStock'
import { filterMovements, movementTotals } from '../utils/stock'

export function StockHistoryPage() {
  const [params, setParams] = useSearchParams()
  const ingredientId = params.get('ingredientId') || ''
  const [from, setFrom] = useState('')
  const [until, setUntil] = useState('')
  const [type, setType] = useState('')
  const [tab, setTab] = useState<'movements' | 'lots'>('movements')
  const [page, setPage] = useState(1)
  const [lotPage, setLotPage] = useState(1)
  const stock = useStock()
  const movements = useStockMovements(ingredientId)
  const lots = useStockLots(ingredientId)
  const ingredient = stock.data?.find(
    (value) => value.ingredientId === ingredientId,
  )
  const filtered = filterMovements(movements.data || [], from, until, type)
  const totals = movementTotals(filtered)
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  )
  const currentLotPage = Math.min(
    lotPage,
    Math.max(1, Math.ceil((lots.data?.length || 0) / PAGE_SIZE)),
  )
  const refresh = () => {
    void stock.refetch()
    void movements.refetch()
    void lots.refetch()
  }
  return (
    <>
      <PageHeading
        eyebrow="Theo dõi kho"
        title="Biến động và lô hàng"
        description="Xem giao dịch kho và các lô nhập của từng nguyên liệu."
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
              setLotPage(1)
              setType('')
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
        <p className="mt-3 text-xs text-slate-400">
          Bộ lọc ngày chỉ áp dụng cho biến động kho. Mọi số lượng đều dùng đơn
          vị cơ sở của nguyên liệu đã chọn.
        </p>
      </Panel>
      {!ingredient ? (
        <Panel className="p-12 text-center text-sm text-slate-500">
          Chọn nguyên liệu để xem biến động kho và lô hàng.
        </Panel>
      ) : (
        <>
          <Panel className="mb-5 space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {ingredient.ingredientName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tồn kho hiện tại:{' '}
                  {ingredient.stockQuantity.toLocaleString('en-GB')}{' '}
                  {ingredient.baseUnit}
                </p>
              </div>
              <Badge tone={ingredient.isActive ? 'green' : 'slate'}>
                {ingredient.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
              </Badge>
            </div>
            <StockRefresh
              updatedAt={
                tab === 'movements'
                  ? movements.dataUpdatedAt
                  : lots.dataUpdatedAt
              }
              refreshing={
                stock.isFetching || movements.isFetching || lots.isFetching
              }
              refresh={refresh}
            />
          </Panel>
          <Panel>
            <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
              <button
                className={
                  tab === 'movements'
                    ? 'min-h-11 rounded-xl bg-emerald-50 px-4 font-semibold text-emerald-800'
                    : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40'
                }
                aria-pressed={tab === 'movements'}
                onClick={() => setTab('movements')}
              >
                Biến động kho
              </button>
              <button
                className={
                  tab === 'lots'
                    ? 'min-h-11 rounded-xl bg-emerald-50 px-4 font-semibold text-emerald-800'
                    : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40'
                }
                aria-pressed={tab === 'lots'}
                onClick={() => setTab('lots')}
              >
                Lô nhập
              </button>
              <Link
                to={`/manager/stock-variance?ingredientId=${ingredientId}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 sm:ml-auto"
              >
                Xem tiêu hao
              </Link>
            </div>
            {tab === 'movements' ? (
              <QueryState
                pending={movements.isPending}
                error={movements.error}
                retry={() => void movements.refetch()}
              >
                <div className="p-4">
                  <SummaryCards
                    items={[
                      {
                        label: 'Lượng nhập ghi nhận',
                        value: `${totals.incoming.toLocaleString('en-GB')} ${ingredient.baseUnit}`,
                        icon: 'plus',
                        note: 'Trong phạm vi bộ lọc đã chọn',
                      },
                      {
                        label: 'Lượng xuất ghi nhận',
                        value: `${totals.outgoing.toLocaleString('en-GB')} ${ingredient.baseUnit}`,
                        icon: 'minus',
                        note: 'Không chỉ bao gồm tiêu hao của bếp',
                      },
                      {
                        label: 'Biến động ròng',
                        value: `${totals.net.toLocaleString('en-GB')} ${ingredient.baseUnit}`,
                        icon: 'activity',
                        note: 'Không phải tồn đầu kỳ hoặc cuối kỳ',
                      },
                      {
                        label: 'Giao dịch',
                        value: filtered.length,
                        icon: 'clipboard',
                        note: 'Phù hợp bộ lọc đã chọn',
                      },
                    ]}
                  />
                  <div className="flex flex-wrap gap-3">
                    <select
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-60"
                      value={type}
                      aria-label="Loại biến động"
                      onChange={(event) => {
                        setType(event.target.value)
                        setPage(1)
                      }}
                    >
                      <option value="">Tất cả loại biến động</option>
                      {[
                        ...new Set(
                          movements.data?.map(
                            (movement) => movement.movementType,
                          ),
                        ),
                      ].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                    <button
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                      disabled={!filtered.length}
                      onClick={() =>
                        downloadCsv(
                          'stock-movements',
                          [
                            'Recorded at (UTC)',
                            'Type',
                            'Quantity change',
                            'Base unit',
                            'Performed by',
                            'Reason',
                          ],
                          filtered.map((movement) => [
                            movement.createdAt,
                            movement.movementType,
                            movement.quantityChange,
                            ingredient.baseUnit,
                            movement.performedByRef || '',
                            movement.reason || '',
                          ]),
                        )
                      }
                    >
                      Xuất CSV
                    </button>
                  </div>
                </div>
                <QueryState
                  pending={false}
                  error={null}
                  retry={refresh}
                  empty={!filtered.length}
                >
                  <MovementTable
                    movements={filtered.slice(
                      (currentPage - 1) * PAGE_SIZE,
                      currentPage * PAGE_SIZE,
                    )}
                    unit={ingredient.baseUnit}
                  />
                </QueryState>
                <Pagination
                  locale="vi"
                  total={filtered.length}
                  page={currentPage}
                  onPage={setPage}
                />
              </QueryState>
            ) : (
              <QueryState
                pending={lots.isPending}
                error={lots.error}
                retry={() => void lots.refetch()}
                empty={!lots.data?.length}
              >
                <LotTable
                  lots={(lots.data || []).slice(
                    (currentLotPage - 1) * PAGE_SIZE,
                    currentLotPage * PAGE_SIZE,
                  )}
                  unit={ingredient.baseUnit}
                />
                <Pagination
                  locale="vi"
                  total={lots.data?.length || 0}
                  page={currentLotPage}
                  onPage={setLotPage}
                />
              </QueryState>
            )}
          </Panel>
        </>
      )}
    </>
  )
}
