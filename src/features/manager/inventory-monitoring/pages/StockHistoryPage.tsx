import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Badge,
  fieldClass,
  PageHeading,
  Pagination,
  Panel,
  secondaryButton,
  SummaryCards,
} from '../../../admin/components/AdminUI'
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
    Math.max(1, Math.ceil(filtered.length / 10)),
  )
  const currentLotPage = Math.min(
    lotPage,
    Math.max(1, Math.ceil((lots.data?.length || 0) / 10)),
  )
  const refresh = () => {
    void stock.refetch()
    void movements.refetch()
    void lots.refetch()
  }
  return (
    <>
      <PageHeading
        eyebrow="Inventory Monitoring"
        title="Movements & Lots"
        description="Review recorded stock transactions and receipt lots for each ingredient."
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
          Date filters apply to movements only. All quantities use the selected
          ingredient's base unit.
        </p>
      </Panel>
      {!ingredient ? (
        <Panel className="p-12 text-center text-sm text-slate-500">
          Select an ingredient to inspect stock movements and lots.
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
                  Current stock:{' '}
                  {ingredient.stockQuantity.toLocaleString('en-GB')}{' '}
                  {ingredient.baseUnit}
                </p>
              </div>
              <Badge tone={ingredient.isActive ? 'green' : 'slate'}>
                {ingredient.isActive ? 'Active' : 'Inactive'}
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
                    : secondaryButton
                }
                aria-pressed={tab === 'movements'}
                onClick={() => setTab('movements')}
              >
                Stock movements
              </button>
              <button
                className={
                  tab === 'lots'
                    ? 'min-h-11 rounded-xl bg-emerald-50 px-4 font-semibold text-emerald-800'
                    : secondaryButton
                }
                aria-pressed={tab === 'lots'}
                onClick={() => setTab('lots')}
              >
                Receipt lots
              </button>
              <Link
                to={`/manager/stock-variance?ingredientId=${ingredientId}`}
                className={`${secondaryButton} sm:ml-auto`}
              >
                Review usage
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
                        label: 'Recorded inflow',
                        value: `${totals.incoming.toLocaleString('en-GB')} ${ingredient.baseUnit}`,
                        icon: 'plus',
                        note: 'Within the selected filters',
                      },
                      {
                        label: 'Recorded outflow',
                        value: `${totals.outgoing.toLocaleString('en-GB')} ${ingredient.baseUnit}`,
                        icon: 'minus',
                        note: 'Not necessarily kitchen consumption',
                      },
                      {
                        label: 'Net movement',
                        value: `${totals.net.toLocaleString('en-GB')} ${ingredient.baseUnit}`,
                        icon: 'activity',
                        note: 'Not an opening or closing stock balance',
                      },
                      {
                        label: 'Transactions',
                        value: filtered.length,
                        icon: 'clipboard',
                        note: 'Matching the selected filters',
                      },
                    ]}
                  />
                  <div className="flex flex-wrap gap-3">
                    <select
                      className={`${fieldClass} sm:w-60`}
                      value={type}
                      aria-label="Movement type"
                      onChange={(event) => {
                        setType(event.target.value)
                        setPage(1)
                      }}
                    >
                      <option value="">All movement types</option>
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
                      className={secondaryButton}
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
                      Export CSV
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
                      (currentPage - 1) * 10,
                      currentPage * 10,
                    )}
                    unit={ingredient.baseUnit}
                  />
                </QueryState>
                <Pagination
                  locale="en"
                  total={filtered.length}
                  page={currentPage}
                  size={10}
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
                    (currentLotPage - 1) * 10,
                    currentLotPage * 10,
                  )}
                  unit={ingredient.baseUnit}
                />
                <Pagination
                  locale="en"
                  total={lots.data?.length || 0}
                  page={currentLotPage}
                  size={10}
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
