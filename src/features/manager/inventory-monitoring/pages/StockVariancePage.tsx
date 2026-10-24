import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  PageHeading,
  Pagination,
  Panel,
  secondaryButton,
  SummaryCards,
} from '../../../admin/components/AdminUI'
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
    Math.max(1, Math.ceil(outgoing.length / 10)),
  )
  const refresh = () => {
    void stock.refetch()
    void movements.refetch()
  }
  return (
    <>
      <PageHeading
        eyebrow="Inventory Monitoring"
        title="Usage & Variance"
        description="Inspect recorded ingredient outflow and check whether usage can be compared with recipe requirements."
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
        <h2 className="font-semibold">Usage variance is not yet available</h2>
        <p className="mt-1">
          A reliable comparison requires prepared-item quantities, historical
          recipe versions, stocktakes, and separately identified disposals.
          These inputs are not available in this report. Recorded stock issues
          alone do not establish actual consumption or wastage.
        </p>
        <p className="mt-1">
          Variance = (actual usage − expected usage) / expected usage × 100%,
          only when expected usage is greater than zero. No stock balances are
          adjusted by this report.
        </p>
      </div>
      {!ingredient ? (
        <Panel className="p-12 text-center text-sm text-slate-500">
          Select an ingredient to review recorded outflow.
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
                label: 'Recorded outflow',
                value: `${totals.outgoing.toLocaleString('en-GB')} ${ingredient.baseUnit}`,
                icon: 'minus',
                note: 'All negative movements in the selected period',
              },
              {
                label: 'Expected usage',
                value: 'Not available',
                icon: 'clipboard',
                note: 'Prepared quantities and recipe snapshots required',
              },
              {
                label: 'Actual usage',
                value: 'Not available',
                icon: 'box',
                note: 'Requires reconciled issue and stocktake data',
              },
              {
                label: 'Usage variance',
                value: 'Not available',
                icon: 'chart',
                note: 'Missing inputs are not treated as zero',
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
                  Recorded outflow · {ingredient.ingredientName}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Review transaction types and reasons before investigating a
                  discrepancy.
                </p>
              </div>
              <Link
                to={`/manager/stock-history?ingredientId=${ingredientId}`}
                className={secondaryButton}
              >
                All movements & lots
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
                  (currentPage - 1) * 10,
                  currentPage * 10,
                )}
                unit={ingredient.baseUnit}
              />
            </QueryState>
            <Pagination
              locale="en"
              total={outgoing.length}
              page={currentPage}
              size={10}
              onPage={setPage}
            />
          </Panel>
        </QueryState>
      )}
    </>
  )
}
