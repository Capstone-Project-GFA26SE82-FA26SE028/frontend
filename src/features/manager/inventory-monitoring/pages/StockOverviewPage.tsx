import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDebounce } from '../../../../hooks/useDebounce'
import {
  Badge,
  fieldClass,
  PageHeading,
  Pagination,
  Panel,
  SearchField,
  secondaryButton,
  SummaryCards,
} from '../../../admin/components/AdminUI'
import { matches } from '../../../admin/utils'
import { QueryState } from '../../menu-management/components/QueryState'
import { tableClass } from '../../menu-management/constants/styles'
import { InventoryTabs } from '../components/InventoryTabs'
import { StockRefresh } from '../components/StockRefresh'
import { useStock } from '../hooks/useStock'
import { stockStatus } from '../utils/stock'

export function StockOverviewPage() {
  const [search, setSearch] = useState('')
  const query = useDebounce(search)
  const [status, setStatus] = useState('')
  const [active, setActive] = useState('')
  const [page, setPage] = useState(1)
  const stock = useStock()
  const all = stock.data || []
  const filtered = all.filter(
    (ingredient) =>
      matches(query, ingredient.ingredientName, ingredient.ingredientCode) &&
      (!status || stockStatus(ingredient) === status) &&
      (!active || ingredient.isActive === (active === 'true')),
  )
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / 10)),
  )
  return (
    <>
      <PageHeading
        eyebrow="Inventory Monitoring"
        title="Stock overview"
        description="Monitor recorded ingredient stock, low-stock alerts, and inventory history."
      />
      <InventoryTabs />
      <QueryState
        pending={stock.isPending}
        error={stock.error}
        retry={() => void stock.refetch()}
      >
        <SummaryCards
          items={[
            {
              label: 'Ingredients',
              value: all.length,
              icon: 'leaf',
              note: 'All ingredient records',
            },
            {
              label: 'In stock',
              value: all.filter((i) => stockStatus(i) === 'In stock').length,
              icon: 'box',
              note: 'Above the alert threshold',
            },
            {
              label: 'Low stock',
              value: all.filter((i) => stockStatus(i) === 'Low stock').length,
              icon: 'bell',
              note: 'Positive stock at or below threshold',
            },
            {
              label: 'Out of stock',
              value: all.filter((i) => stockStatus(i) === 'Out of stock')
                .length,
              icon: 'ban',
              note: 'Zero or negative recorded quantity',
            },
          ]}
        />
        <Panel className="mb-5 p-4">
          <StockRefresh
            updatedAt={stock.dataUpdatedAt}
            refreshing={stock.isFetching}
            refresh={() => void stock.refetch()}
          />
          <p className="mt-3 text-xs leading-5 text-slate-400">
            Stock is shown in each ingredient's base unit. Reserved quantities
            and usable stock may differ from the recorded balance. Quantities
            with different units are not added together.
          </p>
        </Panel>
        <Panel>
          <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
            <SearchField
              value={search}
              onChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
              placeholder="Search ingredient name or code…"
            />
            <select
              aria-label="Stock status"
              className={`${fieldClass} sm:w-44`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
            >
              <option value="">All stock statuses</option>
              {['In stock', 'Low stock', 'Out of stock'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <select
              aria-label="Ingredient activity"
              className={`${fieldClass} sm:w-44`}
              value={active}
              onChange={(event) => {
                setActive(event.target.value)
                setPage(1)
              }}
            >
              <option value="">All ingredients</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <QueryState
            pending={false}
            error={null}
            retry={() => void stock.refetch()}
            empty={!filtered.length}
          >
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-slate-50">
                  <tr>
                    <th>Ingredient</th>
                    <th>Stock on hand</th>
                    <th>Alert threshold</th>
                    <th>Stock status</th>
                    <th>Activity</th>
                    <th className="text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered
                    .slice((currentPage - 1) * 10, currentPage * 10)
                    .map((ingredient) => (
                      <tr key={ingredient.ingredientId}>
                        <td>
                          <p className="font-semibold">
                            {ingredient.ingredientName}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {ingredient.ingredientCode}
                          </p>
                        </td>
                        <td>
                          {ingredient.stockQuantity.toLocaleString('en-GB')}{' '}
                          {ingredient.baseUnit}
                        </td>
                        <td>
                          {ingredient.lowStockThreshold.toLocaleString('en-GB')}{' '}
                          {ingredient.baseUnit}
                        </td>
                        <td>
                          <Badge
                            tone={
                              stockStatus(ingredient) === 'In stock'
                                ? 'green'
                                : stockStatus(ingredient) === 'Low stock'
                                  ? 'amber'
                                  : 'red'
                            }
                          >
                            {stockStatus(ingredient)}
                          </Badge>
                        </td>
                        <td>
                          <Badge tone={ingredient.isActive ? 'green' : 'slate'}>
                            {ingredient.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <Link
                            className={secondaryButton}
                            to={`/manager/stock-history?ingredientId=${ingredient.ingredientId}`}
                          >
                            Movements & lots
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </QueryState>
          <Pagination
            locale="en"
            total={filtered.length}
            size={10}
            page={currentPage}
            onPage={setPage}
          />
        </Panel>
      </QueryState>
    </>
  )
}
